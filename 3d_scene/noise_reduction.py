import numpy as np
import pyvista as pv
from PIL import Image, ImageOps
from matplotlib import pyplot as plt
import cv2

# get image
image_file = "./output_img/1_100300486093_co.jpg"
img = Image.open(image_file)
# mirror_img = ImageOps.mirror(img)
# mirror_img.save('mirror.jpg')
# mirror_img_file = "mirror.jpg"

# get width and height
width = img.width
height = img.height

# create a structured surface
x = np.arange(0, width, 1)
y = np.arange(0, height, 1)
x, y = np.meshgrid(x, y)

z = np.asarray(img)
z =np.flip(z, 0)/2
plt.imshow(z, cmap='gray')

# write from here
new_img = cv2.imread(image_file)
#　グレースケール変換
imgray = cv2.cvtColor(new_img, cv2.COLOR_BGR2GRAY)
#　画像の二値化
ret, thresh = cv2.threshold(imgray, 127, 255, 0, cv2.THRESH_BINARY)
#　輪郭の抽出
contours, hierarchy = cv2.findContours(thresh, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE) # Use cv2.CCOMP for two level hierarchy

# create an empty mask
mask = np.zeros(new_img.shape[:2], dtype=np.uint8)

# loop through the contours
for i, cnt in enumerate(contours):
    # if the contour has no other contours inside of it
    if hierarchy[0][i][3] != -1: # basically look for holes
    # if the size of the contour is less than a threshold (noise) 面積を求めてそのサイズ調整
        if cv2.contourArea(cnt) < 100:
        # Fill the holes in the original image
            cv2.drawContours(new_img, [cnt], 0, (255,255,255), -1)
            # display result


# cv2.imshow("Mask", mask)

# cv2.imshow("Img", new_img)
# # new_img2 = cv2.bitwise_not(new_img, image_file, mask=mask)

# cv2.imshow("Mask", mask)
# cv2.imshow("After", new_img)

# cv2.waitKey()
# cv2.destroyAllWindows()

print(z.shape)
new_img3 =cv2.cvtColor(new_img, cv2.COLOR_BGR2GRAY)
ret_2, thresh_2 = cv2.threshold(new_img3, 127, 255, 0, cv2.THRESH_BINARY)
print(thresh_2.shape)

#　凸凹部分を除去したい
thresh_3 = np.zeros_like(thresh_2)

cv2.imshow("before", thresh_2)


black = 0
white = 255

for _ in range(2):
   for count_goal in range(1,6):
      for i in range(1,len(thresh_2)-1):
         count = 0
         for j in range(len(thresh_2[0])):
            if thresh_2[i][j] == black:
               count += 1
            else:
               count = 0
            if count == count_goal and count_goal<=j<len(thresh[0])-2 and thresh_2[i][j+1] == white:
               up = 0
               down = 0
               for k in range(-1,count_goal+1):
                  up += thresh_2[i-1][j-k]
                  down += thresh_2[i+1][j-k]
               if (int(up) == white*(count_goal+2) and int(down) == black*(count_goal+2)) or (int(up) == black*(count_goal+2) and int(down) == white*(count_goal+2)):
                  for l in range(count_goal):
                     thresh_2[i][j-l] = white
   thresh_2 = np.rot90(thresh_2)
thresh_2 = np.rot90(thresh_2,2)

cv2.imshow("after", thresh_2)
cv2.waitKey()
cv2.destroyAllWindows()



# for i in range(1,510):
#      for j in range(1,510):
#          if (thresh_2[i][j-1] == 255 and thresh_2[i][j] == 0 and thresh_2[i][j+1] == 255) and ((int(thresh_2[i-1][j-1]) + int(thresh_2[i-1][j]) + int(thresh_2[i-1][j+1]) == 765) or (int(thresh_2[i+1][j-1]) + int(thresh_2[i+1][j]) + int(thresh_2[i+1][j+1])) == 765):
#              thresh_2[i][j] = 255
#          elif (thresh_2[i-1][j] == 255 and thresh_2[i][j] == 0 and thresh_2[i+1][j] == 255) and (int(thresh_2[i-1][j-1]) + int(thresh_2[i][j-1]) + int(thresh_2[i+1][j-1]) == 765 or int(thresh_2[i-1][j+1]) + int(thresh_2[i][j+1]) + int(thresh_2[i+1][j+1]) == 765):
#              thresh_2[i][j] = 255

# for i in range(1,510):
#    count = 0
#    for j in range(1,510):
#       if thresh_2[i][j] == 0 :
#          count += 1
#       else:
#          count = 0
#       if count == 2 :
#          if thresh_2[i+1][j] == 255 and (int(thresh_2[i-1][j-1]) + int(thresh_2[i][j-1]) + int(thresh_2[i+1][j-1]) + int(thresh_2[i+2][j-1]) == 1020) and (int(thresh_2[i-1][j+1]) + int(thresh_2[i][j+1]) + int(thresh_2[i+1][j+1]) + int(thresh_2[i+2][j+1]) == 0):
#             thresh_2[i-1][j] = 255
#             thresh_2[i][j] = 255
#             count = 0
#          elif thresh_2[i+1][j] == 255 and (int(thresh_2[i-1][j-1]) + int(thresh_2[i][j-1]) + int(thresh_2[i+1][j-1]) + int(thresh_2[i+2][j-1]) == 0) and (int(thresh_2[i-1][j+1]) + int(thresh_2[i][j+1]) + int(thresh_2[i+1][j+1]) + int(thresh_2[i+2][j+1]) == 1020):
#             thresh_2[i-1][j] = 255
#             thresh_2[i][j] = 255
#             count = 0
#          else:
#             count = 0

# for i in range(1,510):
#    count = 0
#    for j in range(1,510):
#       if thresh_2[i][j] == 0 :
#          count += 1
#       else:
#          count = 0
#       if count == 3 :
#          if thresh_2[i+1][j] == 255 and (int(thresh_2[i-3][j-1]) + int(thresh_2[i-2][j-1]) + int(thresh_2[i-1][j-1]) + int(thresh_2[i][j-1]) + int(thresh_2[i+1][j-1]) == 1275) and (int(thresh_2[i-3][j+1]) + int(thresh_2[i-2][j+1]) + int(thresh_2[i-1][j+1]) + int(thresh_2[i][j+1]) + int(thresh_2[i+1][j+1]) == 0):
#             thresh_2[i-2][j] = 255
#             thresh_2[i-1][j] = 255
#             thresh_2[i][j] = 255
#             count = 0
#          elif thresh_2[i+1][j] == 255 and (int(thresh_2[i-3][j-1]) + int(thresh_2[i-2][j-1]) + int(thresh_2[i-1][j-1]) + int(thresh_2[i][j-1]) + int(thresh_2[i+1][j-1]) == 0) and (int(thresh_2[i-3][j+1]) + int(thresh_2[i-2][j+1]) + int(thresh_2[i-1][j+1]) + int(thresh_2[i][j+1]) + int(thresh_2[i+1][j+1]) == 1275):
#             thresh_2[i-2][j] = 255
#             thresh_2[i-1][j] = 255
#             thresh_2[i][j] = 255
#             count = 0
#          else:
#             count = 0


# for i in range(1,510):
#    count = 0
#    for j in range(1,510):
#       if thresh_2[i][j] == 0 :
#          count += 1
#       else:
#          count = 0
#       if count == 4 :
#          if thresh_2[i+1][j] == 255 and (int(thresh_2[i-4][j-1]) + int(thresh_2[i-3][j-1]) + int(thresh_2[i-2][j-1]) + int(thresh_2[i-1][j-1]) + int(thresh_2[i][j-1]) + int(thresh_2[i+1][j-1]) == 1530) and (int(thresh_2[i-4][j+1]) + int(thresh_2[i-3][j+1]) + int(thresh_2[i-2][j+1]) + int(thresh_2[i-1][j+1]) + int(thresh_2[i][j+1]) + int(thresh_2[i+1][j+1]) == 0):
#             thresh_2[i-3][j] = 255
#             thresh_2[i-2][j] = 255
#             thresh_2[i-1][j] = 255
#             thresh_2[i][j] = 255
#             count = 0
#          elif thresh_2[i+1][j] == 255 and (int(thresh_2[i-4][j-1]) + int(thresh_2[i-3][j-1]) + int(thresh_2[i-2][j-1]) + int(thresh_2[i-1][j-1]) + int(thresh_2[i][j-1]) + int(thresh_2[i+1][j-1]) == 0) and (int(thresh_2[i-4][j+1]) + int(thresh_2[i-3][j+1]) + int(thresh_2[i-2][j+1]) + int(thresh_2[i-1][j+1]) + int(thresh_2[i][j+1]) + int(thresh_2[i+1][j+1]) == 1530):
#             thresh_2[i-3][j] = 255
#             thresh_2[i-2][j] = 255
#             thresh_2[i-1][j] = 255
#             thresh_2[i][j] = 255
#             count = 0
#          else:
#             count = 0

# for i in range(1,510):
#    count = 0
#    for j in range(1,510):
#       if thresh_2[i][j] == 0 :
#          count += 1
#       else:
#          count = 0
#       if count == 5 :
#          if thresh_2[i+1][j] == 255 and (int(thresh_2[i-5][j-1]) + int(thresh_2[i-4][j-1]) + int(thresh_2[i-3][j-1]) + int(thresh_2[i-2][j-1]) + int(thresh_2[i-1][j-1]) + int(thresh_2[i][j-1]) + int(thresh_2[i+1][j-1]) == 1785) and (int(thresh_2[i-5][j+1]) + int(thresh_2[i-4][j+1]) + int(thresh_2[i-3][j+1]) + int(thresh_2[i-2][j+1]) + int(thresh_2[i-1][j+1]) + int(thresh_2[i][j+1]) + int(thresh_2[i+1][j+1]) == 0):
#             thresh_2[i-4][j] = 255
#             thresh_2[i-3][j] = 255
#             thresh_2[i-2][j] = 255
#             thresh_2[i-1][j] = 255
#             thresh_2[i][j] = 255
#             count = 0

#          elif thresh_2[i+1][j] == 255 and (int(thresh_2[i-5][j-1]) + int(thresh_2[i-4][j-1]) + int(thresh_2[i-3][j-1]) + int(thresh_2[i-2][j-1]) + int(thresh_2[i-1][j-1]) + int(thresh_2[i][j-1]) + int(thresh_2[i+1][j-1]) == 0) and (int(thresh_2[i-5][j+1]) + int(thresh_2[i-4][j+1]) + int(thresh_2[i-3][j+1]) + int(thresh_2[i-2][j+1]) + int(thresh_2[i-1][j+1]) + int(thresh_2[i][j+1]) + int(thresh_2[i+1][j+1]) == 1785):
#             thresh_2[i-4][j] = 255
#             thresh_2[i-3][j] = 255
#             thresh_2[i-2][j] = 255
#             thresh_2[i-1][j] = 255
#             thresh_2[i][j] = 255
#             count = 0
#          else:
#             count = 0


# for i in range(1,510):
#    count = 0
#    for j in range(1,510):
#       if thresh_2[i][j] == 0 :
#          count += 1
#       else:
#          count = 0
#       if count == 6 :
#          if thresh_2[i+1][j] == 255 and (int(thresh_2[i-6][j-1]) +int(thresh_2[i-5][j-1]) + int(thresh_2[i-4][j-1]) + int(thresh_2[i-3][j-1]) + int(thresh_2[i-2][j-1]) + int(thresh_2[i-1][j-1]) + int(thresh_2[i][j-1]) + int(thresh_2[i+1][j-1]) == 2040) and (int(thresh_2[i-6][j+1]) +int(thresh_2[i-5][j+1]) + int(thresh_2[i-4][j+1]) + int(thresh_2[i-3][j+1]) + int(thresh_2[i-2][j+1]) + int(thresh_2[i-1][j+1]) + int(thresh_2[i][j+1]) + int(thresh_2[i+1][j+1]) == 0):
#             thresh_2[i-5][j] = 255
#             thresh_2[i-4][j] = 255
#             thresh_2[i-3][j] = 255
#             thresh_2[i-2][j] = 255
#             thresh_2[i-1][j] = 255
#             thresh_2[i][j] = 255
#             count = 0
#          elif thresh_2[i+1][j] == 255 and (int(thresh_2[i-6][j-1]) +int(thresh_2[i-5][j-1]) + int(thresh_2[i-4][j-1]) + int(thresh_2[i-3][j-1]) + int(thresh_2[i-2][j-1]) + int(thresh_2[i-1][j-1]) + int(thresh_2[i][j-1]) + int(thresh_2[i+1][j-1]) == 0) and (int(thresh_2[i-6][j+1]) +int(thresh_2[i-5][j+1]) + int(thresh_2[i-4][j+1]) + int(thresh_2[i-3][j+1]) + int(thresh_2[i-2][j+1]) + int(thresh_2[i-1][j+1]) + int(thresh_2[i][j+1]) + int(thresh_2[i+1][j+1]) == 2040):
#             thresh_2[i-5][j] = 255
#             thresh_2[i-4][j] = 255
#             thresh_2[i-3][j] = 255
#             thresh_2[i-2][j] = 255
#             thresh_2[i-1][j] = 255
#             thresh_2[i][j] = 255
#             count = 0
#          else:
#             count = 0

# reduce noise of z

# to here
thresh_2 = np.flip(thresh_2,0)
curvsurf = pv.StructuredGrid(x, y, thresh_2)

# Map the curved surface to a plane - use best fitting plane
curvsurf.texture_map_to_plane(use_bounds=True,inplace=True)

tex = pv.read_texture(image_file)

plotter = pv.Plotter()
axes = pv.Axes(show_actor=True, actor_scale=1.0, line_width=5)
plotter.add_mesh(curvsurf.rotate_x(180, point=axes.origin, inplace=False), texture=tex)

# show or export
plotter.show()
# plotter.export_gltf("test.gltf", save_normals=True, inline_data=True, )



# curvsurf.plot(texture=tex)
# pv.save_meshio("mesh.obj", curvsurf)
