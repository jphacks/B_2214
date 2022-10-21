import argparse
import math
import torch
import torch.nn as nn
from pathlib import Path
from PIL import Image
from sklearn.model_selection import train_test_split
import torch.utils.data as data
import numpy as np
import torch.nn.init as init
import torch.nn.functional as F
import torch.optim as optim

from utils.data_augumentation import Compose, Scale, RandomMirror, Resize, Normalize_Tensor
from utils.pspnet import PSPNet


class DataTransform():
    """
    画像とアノテーションの前処理クラス。訓練時と検証時で異なる動作をする。
    画像のサイズをinput_size x input_sizeにする。
    訓練時はデータオーギュメンテーションする。


    Attributes
    ----------
    input_size : int
        リサイズ先の画像の大きさ。
    color_mean : (R, G, B)
        各色チャネルの平均値。
    color_std : (R, G, B)
        各色チャネルの標準偏差。
    """

    def __init__(self, input_size, color_mean, color_std):
        self.data_transform = {
            'train': Compose([
                Scale(scale=[0.8, 1.1]),
                RandomMirror(0.1),
                Resize(input_size),
                Normalize_Tensor(color_mean, color_std)
            ]),
            'val': Compose([
                Resize(input_size),
                Normalize_Tensor(color_mean, color_std)
            ])
        }

    def __call__(self, phase, img, anno_class_img):
        """
        Parameters
        ----------
        phase : 'train' or 'val'
            前処理のモードを指定。
        """
        return self.data_transform[phase](img, anno_class_img)

class FloorPlanDataset(data.Dataset):

    def __init__(self, img_list, anno_list, phase, transform):
        self.img_list = img_list
        self.anno_list = anno_list
        self.phase = phase
        self.transform = transform

    def __len__(self):
        return len(self.img_list)

    def __getitem__(self, index):
        img, anno_class_img = self.pull_item(index)
        return img, anno_class_img

    def pull_item(self, index):
        image_file_path = self.img_list[index]
        img = Image.open(image_file_path)

        anno_file_path = self.anno_list[index]
        anno_class_img = Image.open(anno_file_path)

        if self.phase == 'train':
            img, anno_class_img = self.transform(self.phase, img, anno_class_img)

            return img, anno_class_img

        else:


            img, anno_class_img = self.transform(self.phase, img, anno_class_img)

            return img, anno_class_img

class PSPLoss(nn.Module):
    """PSPNetの損失関数のクラスです。"""

    def __init__(self, aux_weight=0.4):
        super(PSPLoss, self).__init__()
        self.aux_weight = aux_weight  # aux_lossの重み

    def forward(self, outputs, targets):
        """
        損失関数の計算。

        Parameters
        ----------
        outputs : PSPNetの出力(tuple)
            (output=torch.Size([num_batch, 21, 475, 475]), output_aux=torch.Size([num_batch, 21, 475, 475]))。

        targets : [num_batch, 475, 475]
            正解のアノテーション情報

        Returns
        -------
        loss : テンソル
            損失の値
        """

        loss = F.cross_entropy(outputs[0], targets, reduction='mean')
        loss_aux = F.cross_entropy(outputs[1], targets, reduction='mean')

        return loss+self.aux_weight*loss_aux

def weights_init(m):
    if isinstance(m, nn.Conv2d):
        nn.init.xavier_normal_(m.weight.data)
        if m.bias is not None:
            nn.init.constant_(m.bias, 0.0)

def lambda_epoch(epoch):
    max_epoch = 30
    return math.pow((1-epoch/max_epoch), 0.9)

def train_model(net, dataloaders_dict, criterion, scheduler, optimizer, num_epochs, batch_size):

    # GPUが使えるかを確認
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    print("使用デバイス：", device)

    # ネットワークをGPUへ
    net.to(device)

    # ネットワークがある程度固定であれば、高速化させる
    torch.backends.cudnn.benchmark = True

    # 画像の枚数
    num_train_imgs = len(dataloaders_dict["train"].dataset)
    num_val_imgs = len(dataloaders_dict["val"].dataset)
    batch_size = dataloaders_dict["train"].batch_size

    # イテレーションカウンタをセット
    iteration = 1

    # multiple minibatch
    batch_multiplier = 3

    # epochのループ
    for epoch in range(num_epochs):

        epoch_train_loss = 0.0
        epoch_val_loss = 0.0

        print('-------------')
        print('Epoch {}/{}'.format(epoch+1, num_epochs))
        print('-------------')

        for phase in ['train', 'val']:
            if phase == 'train':
                net.train()
                scheduler.step()
                optimizer.zero_grad()
                print('（train）')

            else:
                if((epoch+1) % 5 == 0):
                    net.eval()
                    print('-------------')
                    print('（val）')
                else:
                    continue

            count = 0
            for imges, anno_class_imges in dataloaders_dict[phase]:
                imges = imges.to(device)
                anno_class_imges = anno_class_imges.to(device)

                if (phase == 'train') and (count == 0):
                    optimizer.step()
                    optimizer.zero_grad()
                    count = batch_multiplier

                with torch.set_grad_enabled(phase == 'train'):
                    outputs = net(imges)
                    loss = criterion(
                        outputs, anno_class_imges.long()) / batch_multiplier

                    if phase == 'train':
                        loss.backward()
                        count -= 1

                        if (iteration % 10 == 0):
                            print('イテレーション {} || Loss: {:.4f}'.format(
                                iteration, loss.item()/batch_size*batch_multiplier))

                        epoch_train_loss += loss.item() * batch_multiplier
                        iteration += 1

                    else:
                        epoch_val_loss += loss.item() * batch_multiplier

        print('-------------')
        print('epoch {} || Epoch_TRAIN_Loss:{:.4f} ||Epoch_VAL_Loss:{:.4f}'.format(
            epoch+1, epoch_train_loss/num_train_imgs, epoch_val_loss/num_val_imgs))

        torch.save(net.state_dict(), 'weights/pspnet50_1021_1919' + str(epoch+1) + '.pth')

def main(args):
    data_dir = Path('./dataset/data')
    anno_dir = Path('./dataset/annotations')

    img_names = []
    for path in anno_dir.iterdir():
        img_names.append(path.stem)

    train_imgs, val_imgs = train_test_split(img_names, test_size=0.1)

    train_img_list = []
    train_anno_list = []
    val_img_list = []
    val_anno_list = []

    for train_img in train_imgs:
        train_img_list.append(str(data_dir / f'{train_img}.jpg'))
        train_anno_list.append(str(anno_dir / f'{train_img}.jpg'))

    for val_img in val_imgs:
        val_img_list.append(str(data_dir / f'{val_img}.jpg'))
        val_anno_list.append(str(anno_dir / f'{val_img}.jpg'))

    color_mean = (0.485, 0.456, 0.406)
    color_std = (0.229, 0.224, 0.225)

    train_dataset = FloorPlanDataset(train_img_list, train_anno_list, phase="train", transform=DataTransform(
        input_size=475, color_mean=color_mean, color_std=color_std))

    val_dataset = FloorPlanDataset(val_img_list, val_anno_list, phase="val", transform=DataTransform(
        input_size=475, color_mean=color_mean, color_std=color_std))

    # DataLoader作成
    batch_size = args.batch_size

    train_dataloader = data.DataLoader(
        train_dataset, batch_size=batch_size, shuffle=True, drop_last=True)

    val_dataloader = data.DataLoader(
        val_dataset, batch_size=batch_size, shuffle=False, drop_last=True)

    # 辞書型変数にまとめる
    dataloaders_dict = {"train": train_dataloader, "val": val_dataloader}

    model = PSPNet(n_classes=150)

    state_dict = torch.load("weights/pspnet50_ADE20K.pth")
    model.load_state_dict(state_dict)

    n_classes = 2
    model.decode_feature.classification = nn.Conv2d(
        in_channels=512, out_channels=n_classes, kernel_size=1, stride=1, padding=0)

    model.aux.classification = nn.Conv2d(
        in_channels=256, out_channels=n_classes, kernel_size=1, stride=1, padding=0)

    model.decode_feature.classification.apply(weights_init)
    model.aux.classification.apply(weights_init)

    criterion = PSPLoss(aux_weight=0.4)
    optimizer = optim.SGD([
                                {'params': model.feature_conv.parameters(), 'lr': 1e-3},
                                {'params': model.feature_res_1.parameters(), 'lr': 1e-3},
                                {'params': model.feature_res_2.parameters(), 'lr': 1e-3},
                                {'params': model.feature_dilated_res_1.parameters(), 'lr': 1e-3},
                                {'params': model.feature_dilated_res_2.parameters(), 'lr': 1e-3},
                                {'params': model.pyramid_pooling.parameters(), 'lr': 1e-3},
                                {'params': model.decode_feature.parameters(), 'lr': 1e-2},
                                {'params': model.aux.parameters(), 'lr': 1e-2},
                                ], momentum=0.9, weight_decay=0.0001)

    scheduler = optim.lr_scheduler.LambdaLR(optimizer, lr_lambda=lambda_epoch)
    num_epochs = args.num_epochs
    train_model(model, dataloaders_dict, criterion, scheduler, optimizer, num_epochs=num_epochs, batch_size=batch_size)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('num_epochs', type=int)
    parser.add_argument('batch_size', type=int)
    args = parser.parse_args()
    main(args)
