import cv2 as cv2
import numpy as np
import scipy.ndimage as snd


def normalize(img):
    return (img - np.mean(img)) / np.std(img)


def get_gaussian2d(size, sigma):
    g = cv2.getGaussianKernel(size, sigma)
    return g * g.T


def get_laplacian2d(gaussian):
    center = gaussian.shape[0] // 2
    unit_ker = np.zeros(gaussian.shape)
    unit_ker[center, center] = 1

    return unit_ker - gaussian


def get_fft_magnitude(image):
    return np.log(np.abs(np.fft.fftshift(np.fft.fft2(image))))


def combine_filters(*args):
    if len(args) != 0:
        ker = args[0]
        for i in range(1, len(args)):
            ker = snd.convolve(ker, args[i])
        return ker

    else:
        raise Exception("No filters were passed to combine")


def apply_filters(img, *args):
    return snd.convolve(img, combine_filters(*args), mode="reflect")


def convolve_gaussian2d(image, size, sigma):
    gaussian = cv2.getGaussianKernel(size, sigma)
    image = apply_filters(image, gaussian)
    image = apply_filters(image, gaussian.T)
    return image


#
#
# def resize_images(im1, im2):
#     if im1.shape == im2.shape:
#         return im1, im2
#     sz1_h, sz1_l = im1.shape
#     sz2_h, sz2_l = im2.shape
#     height = min(sz1_h, sz2_h)
#     length = min(sz1_l, sz2_l)
#
#     margin1_h, margin1_l = sz1_h - height, sz1_l - length
#     margin2_h, margin2_l = sz2_h - height, sz2_l - length
#
#     im1 = im1[margin1_h // 2: height - margin1_h // 2, margin1_l // 2: length - margin1_l // 2]
#     im2 = im2[margin2_h // 2: height - margin2_h // 2, margin2_l // 2: length - margin2_l // 2]
#     return im1, im2
