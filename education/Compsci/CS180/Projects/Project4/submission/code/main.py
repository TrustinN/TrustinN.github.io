import os

import matplotlib.pyplot as plt
import numpy as np
from Part1 import Part1
from Part2 import Part2
from utils import ImageUtils

dataPath = (
    "/Users/trustinnguyen/Downloads/Berkeley/Compsci/CS180/Projects/Project4/data/"
)

kpPath = os.path.join(dataPath, "key_points")

images, names = ImageUtils.getImages(dataPath)

# h1, coords1 = Part2.getHarris(images[0])
# d1 = Part2.getDescriptors(images[0], coords1)
#
# h2, coords2 = Part2.getHarris(images[1])
# d2 = Part2.getDescriptors(images[1], coords2)
#
# m1, m2 = Part2.featureMatch(d1, d2, coords1, coords2)
#
# f, axes = plt.subplots(1, 2)
# axes[0].imshow(images[0])
# m1 = np.array(m1)
# axes[0].scatter(m1[:, 0], m1[:, 1], c="r")
# for i in range(len(m1)):
#     axes[0].text(m1[i, 0], m1[i, 1], f"{i}")
# axes[1].imshow(images[1])
# m2 = np.array(m2)
# axes[1].scatter(m2[:, 0], m2[:, 1], c="r")
# for i in range(len(m2)):
#     axes[1].text(m2[i, 0], m2[i, 1], f"{i}")
# plt.show()
#
# H = Part2.ransac(m1, m2, 1000)
# im1, disp, c = Part1.warpImage(images[0], H)
# plt.imshow(im1.astype(np.uint8))
# plt.show()


mosaic = Part2.panorama(images, names, kpPath, "ms", sigma=10, save=4)


print("done")
