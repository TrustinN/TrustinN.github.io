import os

import matplotlib.pyplot as plt
import numpy as np
import skimage as sk
import skimage.io as skio
from Part1 import Part1
from skimage.color import rgb2gray
from utils import Harris, ImageUtils, KeyPointSelector, PlotUtils


class Part2:
    def getHarris(im):
        bw = rgb2gray(im)
        h, coords = Harris.get_harris_corners(bw)
        coords = np.array([coords[1], coords[0]]).T
        return h, coords

    def getDescriptors(im, coords):
        d = []
        r = np.array([20, 20])
        shape = im.shape[:2]
        for c in coords:
            c1 = ImageUtils.fitPoint(shape, c - r)
            c2 = ImageUtils.fitPoint(shape, c + r)
            patch = im[c1[1] : c2[1], c1[0] : c2[0]]
            if patch.shape[0] == patch.shape[1]:
                if patch.shape[0] == 40:
                    # sample by 5
                    patch = ImageUtils.convolve_gaussian2d(patch, 18, 3)
                    patch = patch[::5, ::5]
                    d.append(ImageUtils.normalize(patch))

        return d

    def getNN(vec, pool):
        """
        Returns two of the nearest neighbors in pool to vec
        """
        nn1, nn2 = None, None
        d1, d2 = np.inf, np.inf
        iBest = 0
        for i in range(len(pool)):
            v = pool[i]
            currDist = ImageUtils.L2dist(v, vec)
            if currDist < d1:
                nn1, nn2 = v, nn1
                d1, d2 = currDist, d1
                iBest = i
            elif currDist < d2:
                nn2 = v
                d2 = currDist
        return nn1, nn2, d1, d2, iBest

    def featureMatch(d1, d2, p1, p2, threshold=0.5):
        """
        Takes in two arrays of descriptor vectors d1 and d2. Returns
        a new pair of descriptor arrays of nearest neighbor matches pairwise
        """
        matchD1, matchD2 = [], []
        for j in range(len(d1)):
            d = d1[j]
            nn1, nn2, dist1, dist2, idx = Part2.getNN(d, d2)
            if dist1 / dist2 < threshold:
                matchD1.append(p1[j])
                matchD2.append(p2[idx])
        return matchD1, matchD2

    def withinDist(p1, p2, tol=1):
        return 1 if np.sum(np.square(p1 - p2)) < tol else 0

    def ransac(p1, p2, iter=1000):
        """
        Computes best homography from p1 to p2 using ransac
        """
        num = len(p1)
        bestH = None
        inliers = 0
        p1, p2 = np.array(p1), np.array(p2)
        for i in range(iter):
            choices = np.random.choice(num, 4, replace=False)
            points = p1[choices]
            dest = p2[choices]
            H = Part1.computeH(points, dest)

            imageH = [Part1.applyH(H, p) for p in p1]
            currInliers = sum(
                [Part2.withinDist(p2[k], imageH[k]) for k in range(len(imageH))]
            )
            if currInliers > inliers:
                bestH = H
                inliers = currInliers
        return bestH

    def computeRobustH(im1, im2):
        h1, coords1 = Part2.getHarris(im1)
        d1 = Part2.getDescriptors(im1, coords1)

        h2, coords2 = Part2.getHarris(im2)
        d2 = Part2.getDescriptors(im2, coords2)

        m1, m2 = Part2.featureMatch(d1, d2, coords1, coords2)
        H = Part2.ransac(m1, m2, 1000)
        return H

    def panorama(imgs, names, kpPath, basename, sigma, save=0, automatic=True):
        """
        Imgs is a dictionary of images accessible by their name.
        Kps is a dictionary of the keypoints used accessible by name also.

        The format is kps[imgName1 + "_to_" + "base" + n]
        for the keypoints on image 1.
        This represents the keypoints that will be mapped onto the base image
        on the n-th iteration.

        In this case, imgName 2 will always be "base" because we are mapping
        all images onto a base image.
        """

        numImgs = len(imgs)
        idx = numImgs // 2
        mosaic = imgs[idx]

        kps = KeyPointSelector()
        iter = 0

        mW, mH, _ = mosaic.shape

        disp = np.array([0, 0])
        stack = [np.array([mH // 2, mW // 2]), np.array([mH // 2, mW // 2])]

        while True:
            center = stack.pop(0) + disp

            iter = (1 if iter < 0 else -1) * (abs(iter) + 1)
            idx += iter

            if idx < 0 or idx == numImgs:
                break

            currImage = imgs[idx]
            if automatic:
                H = Part2.computeRobustH(currImage, mosaic)
            else:
                kpCurr, kpBase = kps.getKeyPoints(
                    currImage,
                    mosaic,
                    os.path.join(kpPath, f"{names[idx]}_to_base{abs(iter) - 1}.json"),
                    os.path.join(kpPath, f"base{abs(iter) - 1}.json"),
                    save=(True if save <= 0 else False),
                )
                H = Part1.computeH(kpCurr, kpBase)
            save -= 1
            mosaic, newCenter, disp = Part1.mosaic(currImage, mosaic, H, center, sigma)
            stack.append(newCenter)

            if save == 0:
                skio.imsave("mosaic.png", mosaic.astype(np.uint8))

            plt.imshow(mosaic.astype(np.uint8))
            plt.show()

        return mosaic
