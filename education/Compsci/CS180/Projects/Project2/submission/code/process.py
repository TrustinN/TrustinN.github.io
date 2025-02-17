import numpy as np
import skimage.io as skio

from utils import normalize
from utils import apply_filters
from utils import get_fft_magnitude
from utils import get_gaussian2d, get_laplacian2d, convolve_gaussian2d

from plot import show_plots
from stack import LaplacianStack, GaussianStack


def get_edges(image, ker_x, ker_y, threshold=0.5):
    img_x = apply_filters(image, ker_x)
    img_y = apply_filters(image, ker_y)

    edge_img = np.sqrt(np.square(img_x) + np.square(img_y))
    edge_img = normalize(edge_img)

    return np.where(abs(edge_img) > threshold * 3, 1, 0).astype(np.uint8)


def img_sharpen(img, sigma, alpha, single=False):
    color = len(img.shape) == 3
    if color:
        img = img / 255
        sharpened = [np.clip(img_sharpen(img[:, :, i], sigma, alpha, single) * 255, 0, 255).astype(np.uint8) for i in range(3)]
        return np.dstack(sharpened)

    else:
        if single:
            gaussian = get_gaussian2d(6 * sigma + 1, sigma)
            center = gaussian.shape[0] // 2
            unit_ker = np.zeros(gaussian.shape)
            unit_ker[center, center] = 1 + alpha

            output = apply_filters(img, unit_ker - alpha * gaussian)
        else:
            get_gaussian2d(6 * sigma, sigma)
            blurred = convolve_gaussian2d(img, 6 * sigma, sigma)
            high_freq = img - blurred
            skio.imshow(high_freq)
            skio.show()
            output = img + alpha * high_freq
        # min_val = np.min(output)
        # if min_val < 0:
        #     output = output - min_val

        return output


def hybrid_image(im1, im2, sigma1, sigma2, plot=False):

    color = len(im1.shape) == 3
    if color:
        im1 = im1 / 255
        im2 = im2 / 255
        hybrids = [hybrid_image(im1[:, :, i], im2[:, :, i], sigma1, sigma2, plot) for i in range(3)]
        hybrids = [np.clip(h.astype(np.uint8), 0, 255) for h in hybrids]
        return np.dstack(hybrids)

    else:
        if plot:
            c1, c2, c3 = [im1], [im2], []

        g2 = get_gaussian2d(6 * sigma1, sigma1)
        g1 = get_gaussian2d(6 * sigma2, sigma2)
        g1 = get_laplacian2d(g1)

        im1 = apply_filters(im1, g1)
        im2 = apply_filters(im2, g2)
        if plot:
            c1.append(im1), c2.append(im2)
            c1.append(get_fft_magnitude(im1)), c2.append(get_fft_magnitude(im2))

        hybrid = (im1 + im2) * 255
        hybrid = np.clip(hybrid, 0, 255)

        if plot:
            c3.append(hybrid), c3.append(hybrid), c3.append(get_fft_magnitude(hybrid))
            show_plots(0, c1, c2, c3)

        return hybrid.astype(np.uint8)


def blend(img1, img2, mask, height=5, plot=False):
    shape = img1.shape
    if len(shape) == 3:
        img1 = img1 / 255
        img2 = img2 / 255

        blends = [blend(img1[:, :, i], img2[:, :, i], mask, height=5, plot=plot) for i in range(0, 3)]
        print(blends)
        blends = [np.clip(b * 255, 0, 255) for b in blends]
        return np.dstack(blends).astype(np.uint8)

    else:
        img1_lstack = LaplacianStack(GaussianStack(img1, height=height))
        img2_lstack = LaplacianStack(GaussianStack(img2, height=height))
        mask_gstack = GaussianStack(mask, height=height + 1)
        mask_gstack.items.pop(0)

        merges, masks, imgs1, imgs2 = [], [], [], []

        shape = img1_lstack.peek().shape
        one = np.ones(shape)
        while mask_gstack.size() > 0:
            mask = mask_gstack.pop()
            im1 = img1_lstack.pop()
            im2 = img2_lstack.pop()
            merges.append(mask * im1 + (one - mask) * im2)
            masks.append(mask)
            imgs1.append(im1)
            imgs2.append(im2)

        res = sum(merges)
        if plot:
            merges.append(res), imgs1.append(res), imgs2.append(res), masks.append(res)
            show_plots(0, merges, imgs1, masks, imgs2)

    return res
