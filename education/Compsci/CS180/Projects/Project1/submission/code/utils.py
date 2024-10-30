import os
import skimage.io as skio


def get_window(img, kwargs):
    return img[kwargs['y0']:kwargs['y1'], kwargs['x0']:kwargs['x1']]


def list_images(path, extension):
    images = []
    if type(extension) is list:
        files = os.listdir(path)
        for f in files:
            ext = f.split(".")[1]
            if ext in extension:
                images.append(f)

    elif type(extension) is str:
        files = os.listdir(path)
        for f in files:
            ext = f.split(".")[1]
            if ext == extension:
                images.append(f)

    else:
        raise Exception("Invalid ext input")

    if len(images) == 1:
        return images[0]

    return images


def view_image(path, name):
    skio.imshow(os.path.join(path, name))
    skio.show()


