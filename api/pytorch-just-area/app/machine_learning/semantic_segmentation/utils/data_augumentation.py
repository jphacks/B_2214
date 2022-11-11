import torch
from torchvision import transforms
from PIL import Image, ImageOps, ImageFilter
import numpy as np


class Compose(object):

    def __init__(self, transforms):
        self.transforms = transforms

    def __call__(self, img, anno_class_img):
        for t in self.transforms:
            img, anno_class_img = t(img, anno_class_img)
        return img, anno_class_img


class Scale(object):
    def __init__(self, scale):
        self.scale = scale

    def __call__(self, img, anno_class_img):

        width = img.size[0]
        height = img.size[1]

        scale = np.random.uniform(self.scale[0], self.scale[1])

        scaled_w = int(width * scale)
        scaled_h = int(height * scale)

        img = img.resize((scaled_w, scaled_h), Image.BICUBIC)

        anno_class_img = anno_class_img.resize(
            (scaled_w, scaled_h), Image.BICUBIC)

        if scale > 1.0:
            left = scaled_w - width
            left = int(np.random.uniform(0, left))

            top = scaled_h-height
            top = int(np.random.uniform(0, top))

            img = img.crop((left, top, left+width, top+height))
            anno_class_img = anno_class_img.crop(
                (left, top, left+width, top+height))

        else:
            img_original = img.copy()
            anno_class_img_original = anno_class_img.copy()

            pad_width = width-scaled_w
            pad_width_left = int(np.random.uniform(0, pad_width))

            pad_height = height-scaled_h
            pad_height_top = int(np.random.uniform(0, pad_height))

            img = Image.new(img.mode, (width, height), (0, 0, 0))
            img.paste(img_original, (pad_width_left, pad_height_top))

            anno_class_img = Image.new(
                anno_class_img.mode, (width, height), (0, 0, 0))
            anno_class_img.paste(anno_class_img_original,
                                 (pad_width_left, pad_height_top))

        return img, anno_class_img


class RandomMirror(object):
    
    def __init__(self, p_thre):
        self.p_thre = p_thre

    def __call__(self, img, anno_class_img):
        p = np.random.rand()
        if p < self.p_thre:
            img = ImageOps.mirror(img)
            anno_class_img = ImageOps.mirror(anno_class_img)
        return img, anno_class_img


class Resize(object):

    def __init__(self, input_size):
        self.input_size = input_size

    def __call__(self, img, anno_class_img):

        img = img.resize((self.input_size, self.input_size),
                         Image.BICUBIC)
        anno_class_img = anno_class_img.resize(
            (self.input_size, self.input_size),  Image.BICUBIC)

        return img, anno_class_img


class Normalize_Tensor(object):
    def __init__(self, color_mean, color_std):
        self.color_mean = color_mean
        self.color_std = color_std

    def __call__(self, img, anno_class_img):

        img = transforms.functional.to_tensor(img)

        img = transforms.functional.normalize(
            img, self.color_mean, self.color_std)

        anno_class_img = anno_class_img.convert('P')
        anno_class_img = np.array(anno_class_img)
        anno_class_img = np.where(anno_class_img != 0, 1, 0)

        anno_class_img = torch.from_numpy(anno_class_img)

        return img, anno_class_img
