import numpy as np
import pyvista as pv
from PIL import Image, ImageOps
from matplotlib import pyplot as plt

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
plt.show()

# write from here

# reduce noise of z

# to here

curvsurf = pv.StructuredGrid(x, y, z)

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
