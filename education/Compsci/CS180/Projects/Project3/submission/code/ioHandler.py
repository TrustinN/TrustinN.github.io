import json
import os

import matplotlib.pyplot as plt
import numpy as np
import skimage.io as skio
import skvideo.io
from scipy.interpolate import griddata
from scipy.spatial import Delaunay
from skimage.draw import polygon
from utils import computeAffine


class GenerateMorph:

    def __init__(self):
        pass

    def setImages(self, imgPath1, imgPath2):
        self.imgPath1 = imgPath1
        self.imgPath2 = imgPath2

        self.outputPath1 = os.path.dirname(imgPath1)
        self.outputPath2 = os.path.dirname(imgPath2)

        self.img1name = os.path.basename(imgPath1).split(".")[0]
        self.img2name = os.path.basename(imgPath2).split(".")[0]

        return skio.imread(imgPath1), skio.imread(imgPath2)

    def setSettings(self, save=False, load=False):
        self.save = save
        self.load = load

    def setKeyPoints(self, img1, img2, kp1=None, kp2=None):
        f, (ax1, ax2) = plt.subplots(1, 2)
        ax1.imshow(img1), ax2.imshow(img2)

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

    def visualizeDelauney(self, img1, img2, kp1, kp2, simplices):
        f, (ax1, ax2) = plt.subplots(1, 2)
        ax1.imshow(img1), ax2.imshow(img2)
        ax1.triplot(kp1[:, 0], kp1[:, 1], simplices, linewidth=1)
        ax2.triplot(kp2[:, 0], kp2[:, 1], simplices, linewidth=1)
        plt.show()

    def getKeyPoints(self, img1, img2, load=False, save=False):
        outputDir1 = os.path.join(
            self.outputPath1, "key_points", self.img1name + ".json"
        )
        outputDir2 = os.path.join(
            self.outputPath2, "key_points", self.img2name + ".json"
        )
        if load:
            kp1, kp2 = self.loadKeyPoints(outputDir1), self.loadKeyPoints(outputDir2)

        else:
            kp1, kp2 = self.setKeyPoints(img1, img2)
            if save:
                self.saveKeyPoints(kp1, outputDir1), self.saveKeyPoints(kp2, outputDir2)

        return np.array(kp1), np.array(kp2)

    def computeMidwayPoints(self, kp1, kp2):
        return (np.array(kp1) + np.array(kp2)) / 2

    def inverseWarp(self, source, sourceTri, dest, destTri, color=True):
        affine = computeAffine(destTri, sourceTri)

        destRR, destCC = polygon(destTri[:, 1], destTri[:, 0])
        sourceRR, sourceCC = polygon(sourceTri[:, 1], sourceTri[:, 0])

        sourcePixels = affine @ np.array([destCC, destRR, np.ones(destRR.shape)])
        interpCC, interpRR = sourcePixels[0], sourcePixels[1]

        points = np.concatenate((np.array([sourceCC]), np.array([sourceRR]))).T
        values = source[sourceRR, sourceCC]

        interp_dest = np.concatenate((np.array([interpCC]), np.array([interpRR]))).T

        if color:
            resR = griddata(
                points, values[:, 0], interp_dest, method="nearest", rescale=True
            )
            resG = griddata(
                points, values[:, 1], interp_dest, method="nearest", rescale=True
            )
            resB = griddata(
                points, values[:, 2], interp_dest, method="nearest", rescale=True
            )
            res = np.dstack([resR, resG, resB])
        else:
            res = griddata(points, values, interp_dest, method="nearest", rescale=True)

        dest[destRR, destCC] = res

    def morphTris(self, source, sourceKp, targetKp, simplices, dest, color=True):
        for s in simplices:
            sourceTri, targetTri = sourceKp[s], targetKp[s]
            self.inverseWarp(source, sourceTri, dest, targetTri, color=color)
        return dest

    def computeMidwaySimplices(self, kp1, kp2):
        kp = np.array([self.computeMidwayPoints(p1, p2) for p1, p2 in zip(kp1, kp2)])
        tri = Delaunay(kp)
        simplices = tri.simplices
        return simplices

    def computeMidwayFaces(self, img1, img2, kp1, kp2, color=True):
        kp = np.array([self.computeMidwayPoints(p1, p2) for p1, p2 in zip(kp1, kp2)])
        tri = Delaunay(kp)
        simplices = tri.simplices

        outputShape = tuple(
            max(img1.shape[i], img2.shape[i]) for i in range(3 if color else 2)
        )

        outImg1 = self.morphTris(
            img1, kp1, kp, simplices, np.zeros(outputShape), color=color
        )
        outImg2 = self.morphTris(
            img2, kp2, kp, simplices, np.zeros(outputShape), color=color
        )

        return (0.5 * (outImg1 + outImg2)).astype(np.uint8), kp, simplices

    def visualizeMidwayFace(self, img1, img2, kp1, kp2):
        f, (ax1, ax2, ax3) = plt.subplots(1, 3)
        ax1.imshow(img1)
        ax2.imshow(self.computeMidwayFaces(img1, img2, kp1, kp2)[0])
        ax3.imshow(img2)
        plt.show()

    def morph(
        self, img1, img2, kp1, kp2, midway, midwayKp, simplices, warpFrac, dissolveFrac
    ):
        start, target = None, None
        startKp, targetKp = None, None

        if warpFrac == 0.5:
            return midway
        if warpFrac < 0.5:
            start, target = img1, midway
            startKp, targetKp = kp1, midwayKp
        else:
            start, target = midway, img2
            startKp, targetKp = midwayKp, kp2
            warpFrac -= 0.5

        if dissolveFrac > 0.5:
            dissolveFrac -= 0.5

        warpFrac *= 2
        dissolveFrac *= 2

        warpKp = np.array(
            [
                startKp[i] + warpFrac * (targetKp[i] - startKp[i])
                for i in range(len(startKp))
            ]
        )
        warpImg1 = self.morphTris(
            start, startKp, warpKp, simplices, np.zeros(midway.shape)
        )
        warpImg2 = self.morphTris(
            target, targetKp, warpKp, simplices, np.zeros(midway.shape)
        )

        return ((1 - dissolveFrac) * warpImg1 + dissolveFrac * warpImg2).astype(
            np.uint8
        )

    def linear(self, num, total):
        return float(num) / (total - 1)

    def generateMorphSequence(
        self, img1, img2, kp1, kp2, numFrames, warpFunc, dissolveFunc
    ):
        midway, midwayKp, simplices = self.computeMidwayFaces(img1, img2, kp1, kp2)

        frames = []
        for i in range(numFrames):
            morph = self.morph(
                img1,
                img2,
                kp1,
                kp2,
                midway,
                midwayKp,
                simplices,
                warpFunc(i, numFrames),
                dissolveFunc(i, numFrames),
            )
            frames.append(morph)
            print("Writing frame", i)
        self.writeVideo(frames, "video2.mp4")

    def writeVideo(self, frames, path):
        skvideo.io.vwrite(path, np.array(frames), outputdict={"-pix_fmt": "yuv420p"})


class ImageMean:
    def __init__(self):
        pass

    def loadImages(self, path1, path2):
        imagesNeutral = []
        imagesSmiling = []
        for i in range(1, 101):
            imagesNeutral.append(
                skio.imread(os.path.join(path1, f"{i}a.jpg"), as_gray=True)
            )
            imagesSmiling.append(
                skio.imread(os.path.join(path1, f"{i}b.jpg"), as_gray=True)
            )
        for i in range(101, 201):
            imagesNeutral.append(
                skio.imread(os.path.join(path2, f"{i}a.jpg"), as_gray=True)
            )
            imagesSmiling.append(
                skio.imread(os.path.join(path2, f"{i}b.jpg"), as_gray=True)
            )
        return imagesNeutral, imagesSmiling

    def loadKeyPoints(self, corners, path):
        kpNeutral = []
        kpSmiling = []

        for i in range(1, 201):
            f = os.path.join(path, f"{i}a.pts")
            with open(os.path.join(path, f)) as file:
                points = file.readlines()
                points = [
                    points[i].strip().split(" ") for i in range(3, len(points) - 1)
                ]
                points = corners + list(map(lambda x: list(map(float, x)), points))
                kpNeutral.append(np.array(points))

            f = os.path.join(path, f"{i}b.pts")
            with open(os.path.join(path, f)) as file:
                points = file.readlines()
                points = [
                    points[i].strip().split(" ") for i in range(3, len(points) - 1)
                ]
                points = corners + list(map(lambda x: list(map(float, x)), points))
                kpSmiling.append(np.array(points))

        return np.array(kpNeutral), np.array(kpSmiling)

    def visualizeMorphs(self, inputImgs, outputImgs, shape):
        f, axes = plt.subplots(shape[0], shape[1])
        numImgs = min(len(inputImgs), len(outputImgs))

        for i in range(0, numImgs, 2):
            axes[i // shape[1]][i % shape[1]].imshow(inputImgs[i // 2])

        for i in range(1, numImgs, 2):
            axes[i // shape[1]][i % shape[1]].imshow(outputImgs[(i - 1) // 2])

        plt.show()

    def extrapolate(self, img1, img2, alpha):
        return np.clip((alpha * img1 + (1 - alpha) * img2), 0, 255).astype(np.uint8)

    def plotResults(self, *args):
        f, axes = plt.subplots(len(args), len(args[0]))
        if len(args) > 1:
            for i in range(len(args)):
                for j in range(len(args[0])):
                    axes[i][j].imshow(args[i][j])
        else:
            for i in range(len(args[0])):
                axes[i].imshow(args[0][i])
        plt.show()
