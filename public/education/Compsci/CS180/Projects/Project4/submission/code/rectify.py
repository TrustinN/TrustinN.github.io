import os

import numpy as np
import skimage.io as skio
from utils import ImageUtils, KeyPointSelector, Part1

dataPath = "/Users/trustinnguyen/Downloads/Berkeley/Compsci/CS180/Projects/Project4/data/sample_runs/"
outputPath = "/Users/trustinnguyen/Downloads/Berkeley/Compsci/CS180/Projects/website/4/media/Part1/rectified/"
kpPath = os.path.join(dataPath, "key_points")

images, names = ImageUtils.getImages(dataPath)
kps = KeyPointSelector()

imgName = "sign"
skio.imsave(
    os.path.join(outputPath, f"{imgName}_original.png"),
    images[names.index(imgName)].astype(np.uint8),
)

im1 = images[names.index(imgName)]
im2 = np.ones(im1.shape)

kp1, kp2 = kps.getKeyPoints(
    im1,
    im2,
    os.path.join(kpPath, f"{imgName}.json"),
    os.path.join(kpPath, f"{imgName}_to_blank.json"),
    save=True,
)

H = Part1.computeH(kp1, kp2)
res, _, _ = Part1.warpImage(im1, H)
skio.imshow(res.astype(np.uint8))
skio.show()
skio.imsave(os.path.join(outputPath, f"{imgName}_rectified.png"), res.astype(np.uint8))
