import numpy as np
from metrics import normalize_image
from scipy import signal


# Not used in my implementation, just testing stuff
def convolve2d(img, kernel):
    k_hgt, k_len = kernel.shape
    img_hgt, img_len = img.shape

    res_shape = np.array(img.shape) + np.array(kernel.shape) - 1
    res = np.zeros(res_shape, dtype=img.dtype)

    for i in range(res_shape[0]):
        for j in range(res_shape[1]):

            begin_img_x = max(0, j - k_len + 1)
            end_img_x = min(img_len, j + 1)

            begin_img_y = max(0, i - k_hgt + 1)
            end_img_y = min(img_hgt, i + 1)

            begin_ker_x = max(k_len - j - 1, 0)
            end_ker_x = min(img_len + k_len - j - 1, k_len)

            begin_ker_y = max(k_hgt - i - 1, 0)
            end_ker_y = min(img_hgt + k_hgt - i - 1, k_hgt)

            val = np.sum(img[begin_img_y:end_img_y, begin_img_x:end_img_x] * kernel[begin_ker_y:end_ker_y, begin_ker_x:end_ker_x])

            res[i, j] = val
    return res


def my_sobel(img):
    kernel_x = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]])
    kernel_y = np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]])

    g_x = signal.convolve2d(img, kernel_x)
    g_y = signal.convolve2d(img, kernel_y)

    output = normalize_image(np.sqrt(np.square(g_x) + np.square(g_y)))
    return output


