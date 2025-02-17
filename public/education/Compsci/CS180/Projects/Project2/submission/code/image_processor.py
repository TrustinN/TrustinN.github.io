import os
import numpy as np
import skimage.io as skio
import subprocess
from skimage.color import rgb2gray

from stack import GaussianStack, LaplacianStack
from process import get_edges
from process import img_sharpen
from process import hybrid_image
from process import blend


class Image():
    def __init__(self, data, name=None, is_gray=False):
        self.name = name
        self.data = data
        self.shape = data.shape
        self.is_gray = is_gray

    def set_name(self, name):
        self.name = name

    def get_image(path, as_gray=False):
        filename = path.split("/")[-1]
        img_name, img_ext = filename.split(".")

        return Image(skio.imread(path, as_gray=as_gray), name=img_name, is_gray=as_gray)

    def show(self):
        skio.imshow(self.data)
        skio.show()

    def __str__(self):
        return f"Image({type(self.data)}, name={self.name})"

    def __repr__(self):
        return f"Image({type(self.data)}, name={self.name})"


class ImageProcessor():
    def __init__(self):
        self.input_dir, self.output_dir = None, None
        self.image_ext = ["tif", "jpeg", "jpg", "png"]
        pass

    def set_io(self, input_path=None, output_path=None):
        if input_path:
            self.input_dir = input_path

        if output_path:
            self.output_dir = output_path

    def load_image(self, **kwargs):

        res = []
        gray = False
        if "as_gray" in kwargs.keys():
            gray = kwargs["as_gray"]

        if "file_paths" in kwargs.keys():
            for f in kwargs["file_paths"]:
                res.append(Image.get_image(f, as_gray=gray))

        elif "file" in kwargs.keys():
            res.append(Image.get_image(kwargs["file"], as_gray=gray))

        else:
            if self.input_dir:
                for img in os.listdir(self.input_dir):
                    if img.split(".")[-1] in self.image_ext:
                        path = os.path.join(self.input_dir, img)
                        img_obj = Image.get_image(path, as_gray=gray)
                        res.append(img_obj)
            else:
                raise Exception("Input path not set")

        self.images = res

        return res

    def save_images(self, images, ext):

        subprocess.run(["mkdir", "-p", self.output_dir])
        if type(images) is not list:
            images = [images]

        for img in images:
            path = os.path.join(self.output_dir, img.name + "." + ext)
            print(f"Saving {img.name} to {path}")
            if img.is_gray:
                skio.imsave(path, (255 * img.data).astype(np.uint8))
            else:
                print(img.data)
                skio.imsave(path, img.data)

    def process(image, gray, f, *args):
        return Image(f(image.data, *args), name=image.name, is_gray=gray)

    def get_gray(image):
        if type(image) is Image:
            return ImageProcessor.process(image, True, rgb2gray)
        else:
            return Image(rgb2gray(image), is_gray=True)

    def get_by_name(self, names):
        return list(filter(lambda x: x.name in names, self.images))

    class GaussianStack(GaussianStack):
        def __init__(self, image, height):
            super().__init__(image.data, height)

    class LaplacianStack(LaplacianStack):
        def __init__(self, gaussian_stack):
            super().__init__(gaussian_stack)

    def get_edges(image, ker_x, ker_y, threshold):
        return Image(get_edges(image.data, ker_x, ker_y, threshold), name=image.name, is_gray=image.is_gray)

    def hybrid_image(img1, img2, sigma1, sigma2, plot=False):
        return Image(hybrid_image(img1.data, img2.data, sigma1, sigma2, plot), is_gray=img1.is_gray)

    def blend(img1, img2, mask, height=5, plot=False):
        return Image(blend(img1.data, img2.data, mask, height, plot), is_gray=img1.is_gray)

    def img_sharpen(img, sigma, alpha, single=False):
        return Image(img_sharpen(img.data, sigma, alpha, single), name=img.name, is_gray=img.is_gray)
