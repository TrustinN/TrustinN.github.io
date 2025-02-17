import numpy as np
import scipy.signal as signal

from utils import get_gaussian2d
from plot import show_plots
from align_image_code import align_images, match_img_size

import skimage.io as skio
from image_processor import Image, ImageProcessor

# Set the input to the directory to pull images from
# implementations are in the process.py file
# Gaussian and Laplacian stacks are in the stack.py file
# utility functions like convolution, applying filters, is in utils.py
# plot method in plot.py file

# ImageProcessor class is just made to apply filters/methods to images

# Uncomment the some parts below to run their corresponding code
# should work if you have the correct file placed in correct location and named the file correctly

input = "/Users/trustinnguyen/Downloads/Berkeley/Compsci/CS180/Projects/Project2/data"
output = "/Users/trustinnguyen/Downloads/Berkeley/Compsci/CS180/Projects/website/2/media"

processor = ImageProcessor()
processor.set_io(input, output)
save = []

###############################################################################
# PART 1                                                                      #
###############################################################################

# # # Part 1.1
# images = processor.load_image(as_gray=True)
# img = processor.get_by_name("cameraman")[0]
#
# fd_x = np.array([[1, -1]])
# fd_y = np.array([[1], [-1]])
# edge_img = ImageProcessor.get_edges(img, ker_x=fd_x, ker_y=fd_y, threshold=0.8)
# edge_img.set_name("finiteDiffCameraman")
# save.append(edge_img)
# edge_img.show()
#
# # Part 1.2
# gaussian = get_gaussian2d(6, 1)
# dog_x = signal.convolve2d(fd_x, gaussian)
# dog_y = signal.convolve2d(fd_y, gaussian)
#
#
# edge_img = ImageProcessor.get_edges(img, ker_x=dog_x, ker_y=dog_y, threshold=.5)
# edge_img.set_name("DOGCameraman")
# save.append(edge_img)
# edge_img.show()
#
# ###############################################################################
# # Part 2                                                                      #
# ###############################################################################
#
# Part 2.1
# gray = False
# images = processor.load_image(as_gray=gray)
# images = processor.get_by_name("taj")[0]
#
# alpha = 2
# sigma = 2
# output = ImageProcessor.img_sharpen(images, sigma, alpha, single=True)
# output.set_name("taj" + ("_gray" if gray else ""))
# save.append(output)
# output.show()
#
# gray = False
# images = processor.load_image(as_gray=gray)
# images = processor.get_by_name("woods")[0]
#
# alpha = 2
# sigma = 2
# output = ImageProcessor.img_sharpen(images, sigma, alpha, single=True)
# output.set_name("woods" + ("_gray" if gray else ""))
# save.append(output)
# output.show()
#
# # Part 2.2
#
# gray = True
# images = processor.load_image()
# img1 = processor.get_by_name(["DerekPicture"])[0]
# img2 = processor.get_by_name(["nutmeg"])[0]
#
# im2_aligned, im1_aligned = align_images(img2.data, img1.data)
# if gray:
#     im1 = ImageProcessor.get_gray(im1_aligned)
#     im2 = ImageProcessor.get_gray(im2_aligned)
# else:
#     im1 = Image(im1_aligned)
#     im2 = Image(im2_aligned)
#
# sigma1 = 3
# sigma2 = 6
#
# hybrid = ImageProcessor.hybrid_image(im2, im1, sigma1, sigma2, plot=True)
# hybrid.set_name("hybrid" + ("_gray" if gray else ""))
# save.append(hybrid)
# hybrid.show()
#
#
#
#
# gray = True
# images = processor.load_image()
# img1 = processor.get_by_name(["bear"])[0]
# img2 = processor.get_by_name(["panda"])[0]
#
# im2_aligned, im1_aligned = align_images(img2.data, img1.data)
# if gray:
#     im1 = ImageProcessor.get_gray(im1_aligned)
#     im2 = ImageProcessor.get_gray(im2_aligned)
# else:
#     im1 = Image(im1_aligned)
#     im2 = Image(im2_aligned)
#
# sigma1 = 3
# sigma2 = 6
#
# hybrid = ImageProcessor.hybrid_image(im2, im1, sigma1, sigma2, plot=True)
# hybrid.set_name("hybrid" + ("_gray" if gray else ""))
# save.append(hybrid)
# hybrid.show()
#
#
# input = "/Users/trustinnguyen/Downloads/Berkeley/Compsci/CS180/Projects/Project2/data/spline/"
# output = "/Users/trustinnguyen/Downloads/Berkeley/Compsci/CS180/Projects/website/2/media/spline/"
# processor.set_io(input, output)
# gray = True
# images = processor.load_image()
# img1 = processor.get_by_name(["tennis ball"])[0]
# img2 = processor.get_by_name(["orange"])[0]
#
# im2_aligned, im1_aligned = align_images(img2.data, img1.data)
# if gray:
#     im1 = ImageProcessor.get_gray(im1_aligned)
#     im2 = ImageProcessor.get_gray(im2_aligned)
# else:
#     im1 = Image(im1_aligned)
#     im2 = Image(im2_aligned)
#
# sigma1 = 3
# sigma2 = 6
#
# hybrid = ImageProcessor.hybrid_image(im1, im2, sigma1, sigma2, plot=True)
# hybrid.set_name("orange_tennis" + ("_gray" if gray else ""))
# save.append(hybrid)
# hybrid.show()

# Part 2.3

# input = "/Users/trustinnguyen/Downloads/Berkeley/Compsci/CS180/Projects/Project2/data/spline/"
# output = "/Users/trustinnguyen/Downloads/Berkeley/Compsci/CS180/Projects/website/2/media/spline/"
#
# plot = True
# gray = True
#
# processor.set_io(input, output)
# processor.load_image(as_gray=gray)
# apple = processor.get_by_name(["apple"])[0]
# orange = processor.get_by_name(["orange"])[0]
#
# if gray:
#     apple_g_stack = ImageProcessor.GaussianStack(apple, height=5)
#     apple_l_stack = ImageProcessor.LaplacianStack(apple_g_stack)
#
#     orange_g_stack = ImageProcessor.GaussianStack(orange, height=5)
#     orange_l_stack = ImageProcessor.LaplacianStack(orange_g_stack)
#
#     if plot:
#         show_plots(1, apple_g_stack.items, apple_l_stack.items, orange_g_stack.items, orange_l_stack.items)
#
# shape = apple.shape
# height, length = shape[0], shape[1]
# black_half = (height, length // 2)
# bh = np.zeros(black_half)
# white_half = (height, length - black_half[1])
# wh = np.ones(white_half)
# mask = np.concatenate((bh, wh), axis=1)
#
# orple = ImageProcessor.blend(orange, apple, mask, height=5, plot=plot)
# orple.set_name("orple" + ("_gray" if gray else ""))
# save.append(orple)
#
# if plot:
#     orple.show()
#
# input = "/Users/trustinnguyen/Downloads/Berkeley/Compsci/CS180/Projects/Project2/data/spline/"
# output = "/Users/trustinnguyen/Downloads/Berkeley/Compsci/CS180/Projects/website/2/media/spline/"
#
# plot = True
# gray = False
#
# processor.set_io(input, output)
# processor.load_image(as_gray=gray)
# tree1 = processor.get_by_name(["tree1"])[0]
# tree2 = processor.get_by_name(["tree2"])[0]
#
# tree1.data, tree2.data = align_images(tree1.data, tree2.data)
#
# shape = tree1.data.shape
# height, length = shape[0], shape[1]
# upper_y = height // 4
# center_y = height // 2
# center_x = length // 2
# mask = np.zeros((height, length)).astype(np.float32)
# for i in range(height):
#     for j in range(length):
#         x_comp = (j - center_x) ** 2
#         if (i - upper_y) ** 2 + x_comp < 100000 and (i - center_y) ** 2 + x_comp > 50000:
#             mask[i][j] = 1.0
#
# tree = ImageProcessor.blend(tree2, tree1, mask, height=5, plot=plot)
# tree.set_name("tree" + ("_gray" if gray else ""))
# tree.show()
# save.append(tree)
#
# input = "/Users/trustinnguyen/Downloads/Berkeley/Compsci/CS180/Projects/Project2/data/spline/"
# output = "/Users/trustinnguyen/Downloads/Berkeley/Compsci/CS180/Projects/website/2/media/spline/"
#
# plot = True
# gray = False
#
# processor.set_io(input, output)
# processor.load_image(as_gray=gray)
# donut = processor.get_by_name(["donut2"])[0]
# bagel = processor.get_by_name(["bagel2"])[0]
#
# bagel.data, donut.data = align_images(bagel.data, donut.data)
#
# shape = bagel.data.shape
# height, length = shape[0], shape[1]
# black_half = (height, length // 2)
# bh = np.zeros(black_half)
# white_half = (height, length - black_half[1])
# wh = np.ones(white_half)
# mask = np.concatenate((bh, wh), axis=1)
#
# dogel = ImageProcessor.blend(donut, bagel, mask, height=5, plot=plot)
# print(dogel.data)
# dogel.set_name("dogel" + ("_gray" if gray else ""))
# dogel.show()
# save.append(dogel)


print("done")




