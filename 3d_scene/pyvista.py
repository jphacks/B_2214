import numpy as np
import pyvista as pv
from PIL import Image

# get image
image_file = "51033_3_480_1000_1.jpg"
img = Image.open(image_file)

# get width and height
width = img.width
height = img.height

# create a structured surface
x = np.arange(0, width, 1)
y = np.arange(0, height, 1)
x, y = np.meshgrid(x, y)


z = np.zeros((height,width))
z[200:300,200:220] = 100
z[40:80,40:60] = 100

curvsurf = pv.StructuredGrid(x, y, z)

# Map the curved surface to a plane - use best fitting plane
curvsurf.texture_map_to_plane(use_bounds=True,inplace=True)

tex = pv.read_texture(image_file)

plotter = pv.Plotter()

plotter.add_mesh(curvsurf, texture=tex)

# plotter.show()
plotter.export_gltf("test.gltf", save_normals=True, inline_data=True)


# curvsurf.plot(texture=tex)
# pv.save_meshio("mesh.obj", curvsurf)
