import numpy as np
from scipy.interpolate import griddata
from skimage.draw import polygon


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
    newCorners = np.array([applyH(H, c) for c in corners])

    # fix the corners so that they are positive
    minX, minY = np.min(newCorners[:, 0]), np.min(newCorners[:, 1])
    newCorners = newCorners - np.array([minX, minY])
    maxX, maxY = np.max(newCorners[:, 0]), np.max(newCorners[:, 1])

    # instantiate the destination image
    res = np.zeros((np.ceil(maxY).astype(int), np.ceil(maxX).astype(int), 3))

    # for indexing into the resulting image
    destRR, destCC = polygon(newCorners[:, 1].astype(int), newCorners[:, 0].astype(int))

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
