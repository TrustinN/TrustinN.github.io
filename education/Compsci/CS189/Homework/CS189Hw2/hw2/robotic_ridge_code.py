import pickle

import matplotlib.pyplot as plt
import numpy as np
import numpy.linalg as LA
from PIL import Image


def load_data() -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    x_train = pickle.load(open("x_train.p", "rb"), encoding="latin1")
    y_train = pickle.load(open("y_train.p", "rb"), encoding="latin1")
    x_test = pickle.load(open("x_test.p", "rb"), encoding="latin1")
    y_test = pickle.load(open("y_test.p", "rb"), encoding="latin1")
    return x_train, y_train, x_test, y_test


def visualize_data(images: np.ndarray, controls: np.ndarray) -> None:
    """
    Args:
        images (ndarray): image input array of size (n, 30, 30, 3).
        controls (ndarray): control label array of size (n, 3).
    """
    # Current images are in float32 format with values between 0.0 and 255.0
    # Just for the purposes of visualization, convert images to uint8
    images = images.astype(np.uint8)
    controls = controls.astype(np.uint8)

    # TODO: Your code here!
    picked = [0, 10, 20]
    f, ax = plt.subplots(1, len(picked))
    for i in range(len(picked)):
        n = picked[i]
        ax[i].imshow(images[n])
    plt.show()


def compute_data_matrix(
    images: np.ndarray, controls: np.ndarray, standardize: bool = False
) -> tuple[np.ndarray, np.ndarray]:
    """
    Args:
        images (ndarray): image input array of size (n, 30, 30, 3).
        controls (ndarray): control label array of size (n, 3).
        standardize (bool): boolean flag that specifies whether the images should be standardized or not

    Returns:
        X (ndarray): input array of size (n, 2700) where each row is the flattened image images[i]
        Y (ndarray): label array of size (n, 3) where row i corresponds to the control for X[i]
    """
    # TODO: Your code here!
    n, w, h, c = images.shape
    X = np.reshape(images, (n, w * h * c))
    Y = controls
    if standardize:
        X = 2 * X / 255 - 1
        Y = 2 * Y / 255 - 1
    return X, Y


def ridge_regression(X: np.ndarray, Y: np.ndarray, lmbda: float) -> np.ndarray:
    """
    Args:
        X (ndarray): input array of size (n, 2700).
        Y (ndarray): label array of size (n, 3).
        lmbda (float): ridge regression regularization term

    Returns:
        pi (ndarray): learned policy of size (2700, 3)
    """
    # TODO: Your code here!
    return np.dot(np.linalg.inv(X.T @ X + lmbda * np.identity(X.shape[1])) @ X.T, Y)


def ordinary_least_squares(X: np.ndarray, Y: np.ndarray) -> np.ndarray:
    """
    Args:
        X (ndarray): input array of size (n, 2700).
        Y (ndarray): label array of size (n, 3).

    Returns:
        pi (ndarray): learned policy of size (2700, 3)
    """
    # TODO: Your code here!
    return np.dot(np.linalg.inv(X.T @ X) @ X.T, Y)


def measure_error(X: np.ndarray, Y: np.ndarray, pi: np.ndarray) -> float:
    """
    Args:
        X (ndarray): input array of size (n, 2700).
        Y (ndarray): label array of size (n, 3).
        pi (ndarray): learned policy of size (2700, 3)

    Returns:
        error (float): the mean Euclidean distance error across all n samples
    """
    # TODO: Your code here!
    n, c = Y.shape
    return np.linalg.norm(X @ pi - Y) / n


def compute_condition_number(X: np.ndarray, lmbda: float) -> float:
    """
    Args:
        X (ndarray): input array of size (n, 2700).
        lmbda (float): ridge regression regularization term

    Returns:
        kappa (float): condition number of the input array with the given lambda
    """
    # TODO: Your code here!
    n, p = X.shape
    m = X.T @ X + lmbda * np.identity(p)
    sigma = np.linalg.svdvals(m)
    return max(sigma) / min(sigma)


if __name__ == "__main__":

    x_train, y_train, x_test, y_test = load_data()
    print("successfully loaded the training and testing data")

    LAMBDA = [0.1, 1.0, 10.0, 100.0, 1000.0]

    # TODO: Your code here!
    # visualize_data(x_test, y_test)
    n, w, h, c = x_train.shape
    X, Y = compute_data_matrix(x_test, y_test, standardize=True)
    for lmbda in LAMBDA:
        w = ridge_regression(X, Y, lmbda)
        error = measure_error(X, Y, w)
        cond = compute_condition_number(X, lmbda)
        print(error, cond)

