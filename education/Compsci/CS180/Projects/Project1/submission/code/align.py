import os
import timeit

import numpy as np
import skimage as sk
import skimage.io as skio
from constants import IMG_EXT, METRICS


# aligns img0 to img1 by searching over a window of possible displacements
def exhaustive_align(img0, img1, metric="ncc", window=[-15, 15]):

    disp = 0, 0
    metric = METRICS[metric]
    align_error = metric.initial_value()

    height, length = img0.shape

    max_win_size = min(length // 16, height // 16)
    window[0] = max(window[0], -max_win_size)
    window[1] = min(window[1], max_win_size)

    if window[0] > window[1]:
        print("Warning: Irregular Window")
        return disp

    frame = {
        "x0": max(0, window[1]),
        "x1": min(length + window[0], length),
        "y0": max(0, window[1]),
        "y1": min(height + window[0], height),
    }

    for i in range(window[0], window[1] + 1):
        for j in range(window[0], window[1] + 1):
            img_new = np.roll(img0, (i, j), axis=(1, 0))
            error = metric.get_score(img_new, img1, **frame)

            if metric.comp(error, align_error):
                disp = i, j
                align_error = error

    return disp


# aligns img0 to img1 using image pyramid recursively
# returns displacement calculated to depth d
def align(img0, img1, metric="ncc", depth=5, window=[-1, 1]):
    if depth == 0:
        disp = exhaustive_align(img0, img1, metric=metric, window=window)
        return disp
    else:
        img0_new = sk.transform.rescale(img0, 0.5)
        img1_new = sk.transform.rescale(img1, 0.5)
        disp = align(
            img0_new,
            img1_new,
            metric=metric,
            depth=depth - 1,
            window=2 * np.array(window),
        )

        disp = disp[0] * 2, disp[1] * 2
        img0 = np.roll(img0, disp, (1, 0))

        new_disp = exhaustive_align(img0, img1, metric=metric, window=window)
        return (disp[0] + new_disp[0], disp[1] + new_disp[1])


# returns new image cropped or ran through filter
def preprocess(img, filter=None):
    height, length = img.shape[0], img.shape[1]
    img = img[
        int(height * 0.15) : int(height * 0.85), int(length * 0.15) : int(length * 0.85)
    ]

    if filter:
        img = filter(img)

    return img


# Input is either the directory or image path
# Output is the output directory
# io is DataIO object in img_io.py: used to write runtime, displacement data and is optional
# metric is list of metrics used to compare image similarity. Currently [Euclidean, ZNCC]
# filter is for edge detection alignment method such that img = filter(img)
def color_align(input, output, io=None, metric="ncc", filter=None):
    root, ext = os.path.splitext(input)
    if not ext:
        files = os.listdir(input)
        for f in files:
            ext = f.split(".")[1]
            if ext in IMG_EXT:
                color_align(
                    os.path.join(input, f), output, io=io, metric=metric, filter=filter
                )

    else:
        # name of the input file
        root, filename = os.path.split(input)
        imname = filename.split(".")[0]
        ext = filename.split(".")[1]

        start = timeit.default_timer()

        # read in the image
        im = skio.imread(input)

        # convert to double (might want to do this later on to save memory)
        im = sk.img_as_float(im)

        # compute the height of each part (just 1/3 of total)
        height = np.floor(im.shape[0] / 3.0).astype(int)

        # separate color channels
        b = im[:height]
        g = im[height : 2 * height]
        r = im[2 * height : 3 * height]

        pg = preprocess(g, filter)
        pr = preprocess(r, filter)
        pb = preprocess(b, filter)

        ag_disp = align(pg, pb, metric=metric)
        ar_disp = align(pr, pb, metric=metric)
        ag = np.roll(g, ag_disp, (1, 0))
        ar = np.roll(r, ar_disp, (1, 0))

        # create a color image
        im_out = np.dstack([ar, ag, b])

        end = timeit.default_timer()
        if io:
            io.append_data(imname, (ag_disp, ar_disp, end - start))

        # save the image
        fname = os.path.join(output, imname + ".jpg")
        skio.imsave(fname, (im_out * 255).astype(np.uint8))
