import json
from pathlib import Path
from PIL import Image
import numpy as np
import cv2

def main():
    data_dir = Path('../dataset/data')
    annotation_path = Path('../dataset/annotation.json')
    save_img_dir = Path('../dataset/annotations/')

    with (annotation_path).open('r') as f:
        annotation = json.load(f)

    count = 0
    for anno in annotation:
        img = np.asarray(Image.open(data_dir / anno['External ID']))
        black_img = np.full_like(img, 0)
        anno_list = []
        for dot in anno['Label']['objects'][0]['polygon']:
            anno_list.append([int(dot['x']), int(dot['y'])])
        mask_poly = np.array(anno_list)
        masked_img = cv2.fillPoly(black_img, [mask_poly], (255, 0, 0))
        if len(masked_img.shape) == 3:
            Image.fromarray(masked_img,mode='RGB').save(save_img_dir / anno['External ID'])
        else:
            count += 1
    print(count)


if __name__ == '__main__':
    main()
