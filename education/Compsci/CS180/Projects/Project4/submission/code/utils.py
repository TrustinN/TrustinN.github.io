import json
import os

import cv2 as cv2
import matplotlib.pyplot as plt
import numpy as np
import scipy.ndimage as snd
import skimage.io as skio
from skimage.feature import corner_harris, peak_local_max


class KeyPointSelector:

    def __init__(self):
        pass

    def setKeyPoints(self, img1, img2, kp1=None, kp2=None):
        f, (ax1, ax2) = plt.subplots(1, 2)
        ax1.imshow(img1.astype(np.uint8)), ax2.imshow(img2.astype(np.uint8))

        if kp1 is not None and kp2 is not None:
            self.labelKeyPoints(ax1=ax1, kp1=kp1)
            self.labelKeyPoints(ax2=ax2, kp2=kp2)

            kp = f.ginput(n=-1, timeout=-1, show_clicks=True)
            kp1 = np.concatenate((kp1, kp[::2]), axis=0)
            kp2 = np.concatenate((kp2, kp[1::2]), axis=0)

        elif kp1 is not None:
            self.labelKeyPoints(ax1=ax1, kp1=kp1)
            kp2 = f.ginput(n=-1, timeout=-1, show_clicks=True)

        elif kp2 is not None:
            self.labelKeyPoints(ax2=ax2, kp2=kp2)
            kp1 = f.ginput(n=-1, timeout=-1, show_clicks=True)

        else:
            kp = f.ginput(n=-1, timeout=-1, show_clicks=True)
            kp1, kp2 = kp[::2], kp[1::2]

        plt.close()

        return kp1, kp2

    def saveKeyPoints(self, keyPoints, file):
        if not os.path.exists(os.path.dirname(file)):
            os.mkdir(os.path.dirname(file))
        with open(file, "w") as f:
            json.dump(keyPoints, f)

    def loadKeyPoints(self, file):
        with open(file) as f:
            return json.load(f)

    def labelKeyPoints(self, ax1=None, ax2=None, kp1=None, kp2=None):

        if kp1 is not None and ax1 is not None:
            ax1.scatter(x=kp1[:, 0], y=kp1[:, 1], s=10)
            for i in range(len(kp1)):
                ax1.text(kp1[i][0], kp1[i][1], f"{i}")
        if kp2 is not None and ax2 is not None:
            ax2.scatter(x=kp2[:, 0], y=kp2[:, 1], s=10)
            for i in range(len(kp2)):
                ax2.text(kp2[i][0], kp2[i][1], f"{i}")

    def visualizeKeyPoints(self, img1, img2, kp1, kp2):
        f, (ax1, ax2) = plt.subplots(1, 2)
        ax1.imshow(img1), ax2.imshow(img2)
        self.labelKeyPoints(ax1=ax1, kp1=kp1)
        self.labelKeyPoints(ax2=ax2, kp2=kp2)
        plt.show()

    def getKeyPoints(self, img1, img2, outputPath1, outputPath2, save=True):
        if not save:
            kp1, kp2 = self.loadKeyPoints(outputPath1), self.loadKeyPoints(outputPath2)

        else:
            kp1, kp2 = self.setKeyPoints(img1, img2)
            if save:
                self.saveKeyPoints(kp1, outputPath1)
                self.saveKeyPoints(kp2, outputPath2)

        return np.array(kp1), np.array(kp2)


class ImageUtils:
    imgExt = {"jpeg", "jpg", "png", "gif"}

    def getImages(path):
        images = []
        names = []
        for f in sorted(os.listdir(path)):
            fparts = f.split(".")
            if len(fparts) > 1:
                basename, ext = fparts
                if ext in ImageUtils.imgExt:
                    images.append(skio.imread(os.path.join(path, f)))
                    names.append(basename)

        return images, names

    def clip(a, n, b):
        if n < a:
            return a
        if n > b:
            return b
        return n

    def L2dist(im1, im2):
        return np.sum(np.square(im1 - im2))

    def fitPoint(shape, point):
        point[0] = ImageUtils.clip(0, point[0], shape[1] - 1)
        point[1] = ImageUtils.clip(0, point[1], shape[0] - 1)
        return point

    def normalize(im):
        return (im - np.mean(im)) / np.std(im)

    def nonzeroMask(im):
        rgb = im[:, :, 0], im[:, :, 1], im[:, :, 2]
        return np.where(np.logical_or(rgb[0] > 0, rgb[1] > 0, rgb[2] > 0), 1, 0)

    def applyMask(im, mask):
        rgb = im[:, :, 0], im[:, :, 1], im[:, :, 2]
        return np.dstack(rgb * mask)

    def maxShape(im1, im2):
        y1, x1 = im1.shape[:2]
        y2, x2 = im2.shape[:2]
        return (max(y1, y2), max(x1, x2), 3)

    def padResize(im, shape):
        dx, dy = int(shape[1] - im.shape[1]), int(shape[0] - im.shape[0])
        zeros = np.zeros((len(im), dx, 3))
        im = np.concatenate((im, zeros), axis=1)
        zeros = np.zeros((dy, len(im[0]), 3))
        return np.concatenate((im, zeros), axis=0)

    def padAlign(im, dx, dy):
        """
        Zero pads image to move image by displacement provided
        """
        zeros = np.zeros((int(im.shape[0]), int(abs(dx)), 3), dtype=np.uint8)
        im = np.concatenate((zeros, im), axis=1)

        zeros = np.zeros((int(abs(dy)), int(im.shape[1]), 3), dtype=np.uint8)
        im = np.concatenate((zeros, im), axis=0)

        return im

    def convolve_gaussian2d(image, size, sigma):
        gaussian = cv2.getGaussianKernel(size, sigma)

        if len(image.shape) == 3:
            rgb = image[:, :, 0], image[:, :, 1], image[:, :, 2]
            rgb = np.array(
                [snd.convolve(rgb[i], gaussian, mode="nearest") for i in range(3)]
            )
            rgb = np.array(
                [snd.convolve(rgb[i], gaussian.T, mode="nearest") for i in range(3)]
            )
            image = np.dstack(rgb)

        else:
            image = snd.convolve(image, gaussian, mode="nearest")
            image = snd.convolve(image, gaussian.T, mode="nearest")

        return image


class PlotUtils:
    def plotImages(*args):
        f, axes = plt.subplots(len(args), len(args[0]))
        if len(args) > 1 and len(args[0]) > 1:
            for i in range(len(args)):
                for j in range(len(args[0])):
                    axes[i][j].imshow(args[i][j])
        else:
            for i in range(len(args[0])):
                axes[i].imshow(args[0][i])

        plt.show()


class Harris:

    def get_harris_corners(im, edge_discard=20):
        """
        This function takes a b&w image and an optional amount to discard
        on the edge (default is 5 pixels), and finds all harris corners
        in the image. Harris corners near the edge are discarded and the
        coordinates of the remaining corners are returned. A 2d array (h)
        containing the h value of every pixel is also returned.

        h is the same shape as the original image, im.
        coords is 2 x n (ys, xs).
        """

        assert edge_discard >= 20

        # find harris corners
        h = corner_harris(im, method="eps", sigma=20)
        coords = peak_local_max(h, min_distance=10)

        # discard points on edge
        edge = edge_discard  # pixels
        mask = (
            (coords[:, 0] > edge)
            & (coords[:, 0] < im.shape[0] - edge)
            & (coords[:, 1] > edge)
            & (coords[:, 1] < im.shape[1] - edge)
        )
        coords = coords[mask].T
        return h, coords

    def dist2(x, c):
        """
        dist2  Calculates squared distance between two sets of points.

        Description
        D = DIST2(X, C) takes two matrices of vectors and calculates the
        squared Euclidean distance between them.  Both matrices must be of
        the same column dimension.  If X has M rows and N columns, and C has
        L rows and N columns, then the result has M rows and L columns.  The
        I, Jth entry is the  squared distance from the Ith row of X to the
        Jth row of C.

        Adapted from code by Christopher M Bishop and Ian T Nabney.
        """

        ndata, dimx = x.shape
        ncenters, dimc = c.shape
        assert (dimx == dimc, "Data dimension does not match dimension of centers")

        return (
            (np.ones((ncenters, 1)) * np.sum((x**2).T, axis=0)).T
            + np.ones((ndata, 1)) * np.sum((c**2).T, axis=0)
            - 2 * np.inner(x, c)
        )
