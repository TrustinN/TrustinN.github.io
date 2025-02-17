import os

import matplotlib.pyplot as plt
import numpy as np
import skimage.io as skio
from scipy.interpolate import griddata
from skimage.draw import polygon
from utils import ImageUtils, KeyPointSelector


class Part1:
    def __init__(self):
        pass

    def applyH(H, u):
        v = H @ np.concatenate((u, np.array([1])))
        return (v / v[-1])[:2]

    def computeH(kp1, kp2):
        """
        Computes the homography matrix sending kp1 -> kp2
        """
        A = np.zeros((2 * len(kp1), 9))
        ones = np.array([np.ones(len(kp1))]).T
        kp1 = np.concatenate((kp1, ones), axis=1)
        kp2 = np.concatenate((kp2, ones), axis=1)
        for i in range(len(kp1)):
            ckp1, ckp2 = kp1[i], kp2[i]
            A[2 * i, :] = np.concatenate((ckp1, np.zeros(3), -ckp1 * ckp2[0]))
            A[2 * i + 1, :] = np.concatenate((np.zeros(3), ckp1, -ckp1 * ckp2[1]))

        b = -A[:, -1]
        A = A[:, :-1]
        x = np.linalg.lstsq(A, b)[0]
        x = np.concatenate((x, np.array([1])))
        return np.reshape(x, (3, 3))

    def warpImage(img, H):
        """
        Returns image under the transformation H.
        """
        # find the new corners under the transformation H on the image
        oldH, oldW = img.shape[:2]
        corners = np.array([[0, 0], [oldW - 1, 0], [oldW - 1, oldH - 1], [0, oldH - 1]])
        newCorners = np.array([Part1.applyH(H, c) for c in corners])

        # fix the corners so that they are positive
        minX, minY = np.min(newCorners[:, 0]), np.min(newCorners[:, 1])
        newCorners = newCorners - np.array([minX, minY])
        maxX, maxY = np.max(newCorners[:, 0]), np.max(newCorners[:, 1])

        # instantiate the destination image
        res = np.zeros((np.ceil(maxY).astype(int), np.ceil(maxX).astype(int), 3))

        # for indexing into the resulting image
        destRR, destCC = polygon(
            newCorners[:, 1].astype(int), newCorners[:, 0].astype(int)
        )

        dest = np.array([destCC, destRR]).T + np.array(
            [minX, minY]
        )  # remember to shift it back to original spot
        ones = np.array([np.ones(len(dest))]).T
        dest = np.concatenate((dest, ones), axis=1)

        # compute pixel locations of result image in source image under transformation
        interpDest = dest @ np.linalg.inv(H).T
        interpDest = np.array([(i / i[2])[:2] for i in interpDest])

        rr, cc = polygon(corners[:, 1].astype(int), corners[:, 0].astype(int))
        points = np.array([cc, rr]).T

        res[destRR, destCC] = griddata(
            points,
            img.reshape((len(img) * len(img[0]), 3)),
            interpDest,
            method="nearest",
        )
        return res, -np.array([minX, minY]), newCorners

    def mosaic(im1, im2, H, center, sigma):
        """
        Warps im1 onto im2 and glues them together into a single image

        The format of the corners:

            c0 . ------------ . c1
               |              |
               |              |
               |              |
            c3 . ____________ . c2

        """
        im1, dxy, im1Corners = Part1.warpImage(im1, H)

        # calculate center based on im1Corners
        topMid = (im1Corners[1] + im1Corners[0]) / 2
        bottomMid = (im1Corners[3] + im1Corners[2]) / 2
        newCenter = (bottomMid + topMid) / 2

        dx, dy = dxy.astype(int)
        im2DX, im2DY = 0, 0
        im1DX, im1DY = 0, 0

        if dx > 0:
            im2DX = dx
        else:
            im1DX = -dx
        if dy > 0:
            im2DY = dy
        else:
            im1DY = -dy

        im1 = ImageUtils.padAlign(im1, int(abs(im1DX)), int(abs(im1DY)))
        im2 = ImageUtils.padAlign(im2, int(abs(im2DX)), int(abs(im2DY)))

        # fix new center by the displacement also
        newCenter += np.array([im1DX, im1DY])
        center += np.array([im2DX, im2DY])

        totalSz = ImageUtils.maxShape(im1, im2)
        im1 = ImageUtils.padResize(im1, totalSz)
        im2 = ImageUtils.padResize(im2, totalSz)

        # run linear interpolation betwen the centers
        dx, dy = center - newCenter

        # compute two lines, one going through center and another through newCenter
        if abs(dy) > abs(dx):
            # use y = slope * x + b
            perp = -dx / dy
            b = newCenter[1] - perp * newCenter[0]

            # plug in y vals
            p1 = np.array([b, 0])
            p2 = np.array([perp * totalSz[1] + b, totalSz[1]])
            nCLine = [p2, p1]

            b = center[1] - perp * center[0]
            p1 = np.array([b, 0])
            p2 = np.array([perp * totalSz[1] + b, totalSz[1]])
            cLine = [p2, p1]

        else:
            # use x = slope * y + b
            perp = -dy / dx
            b = newCenter[0] - perp * newCenter[1]

            # plug in x vals
            p1 = np.array([b, 0])
            p2 = np.array([perp * totalSz[0] + b, totalSz[0]])
            nCLine = [p2, p1]

            b = center[0] - perp * center[1]
            p1 = np.array([b, 0])
            p2 = np.array([perp * totalSz[0] + b, totalSz[0]])
            cLine = [p2, p1]

        def comp(p):
            return np.dot(p - newCenter, np.array([dx, dy])) < 0

        def compBar(p):
            return not comp(p)

        # want corners to one side of our line
        tCorners = np.array(
            [
                [0, 0],
                [totalSz[1] - 1, 0],
                [totalSz[1] - 1, totalSz[0] - 1],
                [0, totalSz[0] - 1],
            ]
        )
        mask = np.zeros((totalSz[0], totalSz[1]))

        im1MaskCorners = np.array(list(filter(comp, tCorners)) + nCLine)
        rr, cc = polygon(im1MaskCorners[:, 1], im1MaskCorners[:, 0])
        mask[rr, cc] = 1

        interpCorners = np.floor(np.array(nCLine + cLine[::-1]))
        rr, cc = polygon(interpCorners[:, 1], interpCorners[:, 0], mask.shape)
        mask[rr, cc] = griddata(
            interpCorners, np.array([1, 1, 0, 0]), np.array([cc, rr]).T
        )

        maskIm1 = ImageUtils.nonzeroMask(im1)
        maskIm2 = ImageUtils.nonzeroMask(im2)

        im1dominant = im1 + ImageUtils.applyMask(im2, 1 - maskIm1)
        im2dominant = ImageUtils.applyMask(im1, 1 - maskIm2) + im2

        mosaic = ImageUtils.applyMask(im1dominant, mask) + ImageUtils.applyMask(
            im2dominant, 1 - mask
        )

        pltU = np.concatenate((im1Corners, np.array([im1Corners[0]]))) + np.array(
            [im1DX, im1DY]
        )

        f, axis = plt.subplots(2, 1)
        axis[0].imshow(mosaic.astype(np.uint8))
        axis[0].scatter(center[0], center[1], s=10, color="r")
        axis[0].scatter(newCenter[0], newCenter[1], s=10, color="b")
        axis[0].plot(pltU[:, 0], pltU[:, 1])

        axis[1].imshow(mask)
        axis[1].scatter(center[0], center[1], s=10, color="r")
        axis[1].scatter(newCenter[0], newCenter[1], s=10, color="b")
        plt.show()

        return (
            mosaic,
            newCenter,
            np.array([im2DX, im2DY]),
        )

    # def panorama(imgs, names, kpPath, basename, sigma, save=0, automatic=True):
    #     """
    #     Imgs is a dictionary of images accessible by their name.
    #     Kps is a dictionary of the keypoints used accessible by name also.
    #
    #     The format is kps[imgName1 + "_to_" + "base" + n]
    #     for the keypoints on image 1.
    #     This represents the keypoints that will be mapped onto the base image
    #     on the n-th iteration.
    #
    #     In this case, imgName 2 will always be "base" because we are mapping
    #     all images onto a base image.
    #     """
    #
    #     numImgs = len(imgs)
    #     idx = numImgs // 2
    #     mosaic = imgs[idx]
    #
    #     kps = KeyPointSelector()
    #     iter = 0
    #
    #     mW, mH, _ = mosaic.shape
    #
    #     disp = np.array([0, 0])
    #     stack = [np.array([mH // 2, mW // 2]), np.array([mH // 2, mW // 2])]
    #
    #     while True:
    #         center = stack.pop(0) + disp
    #
    #         iter = (1 if iter < 0 else -1) * (abs(iter) + 1)
    #         idx += iter
    #
    #         if idx < 0 or idx == numImgs:
    #             break
    #
    #         currImage = imgs[idx]
    #         if automatic:
    #             H = Part2.computeRobustH(currImage, mosaic)
    #         else:
    #             kpCurr, kpBase = kps.getKeyPoints(
    #                 currImage,
    #                 mosaic,
    #                 os.path.join(kpPath, f"{names[idx]}_to_base{abs(iter) - 1}.json"),
    #                 os.path.join(kpPath, f"base{abs(iter) - 1}.json"),
    #                 save=(True if save <= 0 else False),
    #             )
    #             H = Part1.computeH(kpCurr, kpBase)
    #         save -= 1
    #         mosaic, newCenter, disp = Part1.mosaic(currImage, mosaic, H, center, sigma)
    #         stack.append(newCenter)
    #
    #         if save == 0:
    #             skio.imsave("mosaic.png", mosaic.astype(np.uint8))
    #
    #         plt.imshow(mosaic.astype(np.uint8))
    #         plt.show()
    #
    #     return mosaic
