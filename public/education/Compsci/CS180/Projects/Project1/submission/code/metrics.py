import numpy as np
from utils import get_window
from abc import abstractmethod


class Metric:

    # Calculates a score based on image a, b within a given window
    @abstractmethod
    def get_score(a, b, **kwargs):
        pass

    # Determine if score a is better than score b
    @abstractmethod
    def comp(a, b):
        pass

    # return worst score
    @property
    def initial_value():
        pass


class EuclideanDistance(Metric):

    def get_score(a, b, **kwargs):
        a = get_window(a, kwargs)
        b = get_window(b, kwargs)
        return np.linalg.norm(np.subtract(a, b))

    def initial_value():
        return np.inf

    def comp(a, b):
        return a < b


def normalize_image(img):
    return (img - np.mean(img)) / np.std(img)


class NCC(Metric):

    def get_score(a, b, **kwargs):
        a = get_window(a, kwargs)
        b = get_window(b, kwargs)
        height, length = a.shape
        return np.sum(normalize_image(a) * normalize_image(b)) / np.prod(a.shape)

    def initial_value():
        return -np.inf

    def comp(a, b):
        return a > b


