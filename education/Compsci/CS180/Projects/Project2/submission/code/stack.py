from plot import show_plots
from utils import convolve_gaussian2d


class GaussianStack:
    def __init__(self, image, height):
        self.items = [image]

        for i in range(height):
            sigma = 2 ** (height - 1)
            image = convolve_gaussian2d(image, 6 * sigma, sigma)
            self.push(image)

    def push(self, image):
        self.items.append(image)

    def pop(self):
        return self.items.pop(-1)

    def peek(self):
        return self.items[-1]

    def size(self):
        return len(self.items)

    def plot(self):
        show_plots(1, self.items)


class LaplacianStack:
    def __init__(self, gaussian_stack):
        self.items = [
            gaussian_stack.items[i - 1] - gaussian_stack.items[i]
            for i in range(1, len(gaussian_stack.items))
        ]
        self.push(gaussian_stack.peek())

    def push(self, image):
        self.items.append(image)

    def pop(self):
        return self.items.pop(-1)

    def peek(self):
        return self.items[-1]

    def size(self):
        return len(self.items)
