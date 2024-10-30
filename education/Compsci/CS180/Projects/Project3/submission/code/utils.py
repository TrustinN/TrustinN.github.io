import numpy as np


def imgToGraphCoords(points, size):
    return [np.array([size[1], 0]) - np.array(p) for p in points]


def computeMidwayPoints(kp1, kp2):
    return (np.array(kp1) + np.array(kp2)) / 2


def computeAffine(triPts1, triPts2):
    ref1, ref2 = triPts1[0], triPts2[0]
    refX1, refY1 = triPts1[1] - ref1, triPts1[2] - ref1
    refX2, refY2 = triPts2[1] - ref2, triPts2[2] - ref2

    transform1 = np.linalg.inv(np.array([refX1, refY1]).T)
    transform2 = np.array([refX2, refY2]).T

    euclid = transform2 @ transform1
    diff = ref2 - np.dot(euclid, ref1)
    affine = np.concatenate((euclid, np.array([diff]).T), axis=1)
    affine = np.concatenate((affine, np.array([[0, 0, 1]])), axis=0)

    return affine
