import matplotlib.pyplot as plt
import numpy as np

d1 = np.load("./data/dataset_1.npy")
d2 = np.load("./data/dataset_2.npy")


def split_variable(data):
    return data[:, 0], data[:, 1]


def get_distribution(data):
    mean = sum(data).astype(np.float16) / len(data)
    variance = sum(np.square(data - mean)) / (len(data) - 1)
    return mean, variance


def get_covariance(x, y, mu_x, mu_y):
    cov = (x - mu_x) * (y - mu_y)
    return sum(cov) / len(cov)


def get_correlation(cov, var_x, var_y):
    return cov / np.sqrt(var_x * var_y)


d1_X, d1_Y = split_variable(d1)
d2_X, d2_Y = split_variable(d2)

mu1_X, var1_X = get_distribution(d1_X)
mu1_Y, var1_Y = get_distribution(d1_Y)

mu2_X, var2_X = get_distribution(d2_X)
mu2_Y, var2_Y = get_distribution(d2_Y)

cov1_XY = get_covariance(d1_X, d1_Y, mu1_X, mu1_Y)
cov2_XY = get_covariance(d2_X, d2_Y, mu2_X, mu2_Y)

corr1_XY = get_correlation(cov1_XY, var1_X, var1_Y)
corr2_XY = get_correlation(cov2_XY, var2_X, var2_Y)

# plt.scatter(d1_X, d1_Y, color="red")
# plt.scatter(d2_X, d2_Y, color="blue")


def least_square(x, y, feature='nonlinear'):
    if feature == 'linear':
        return np.dot(x, y) / np.dot(x, x)
    elif feature == 'nonlinear':
        xTx = x.T @ x
        a = np.linalg.inv(xTx)
        lhs = (x.T @ y)
        return a @ lhs


def get_mse(x, y, w):
    estimate = np.dot(x, w)
    error = estimate - y
    mean_squared_error = np.dot(error, error) / len(estimate)
    return mean_squared_error


def plot_fit(data, fit, shape):
    # data is an array of data
    # fit is an array of fits that fit each data piece in data
    rows, cols = shape
    f, axes = plt.subplots(rows, cols)
    if axes.shape[0] == 1:
        for i in range(len(data)):
            curr_data = data[i]
            x, y = curr_data[:, 0], curr_data[:, 1]
            axes[i].scatter(x, y, color="red")

            curr_fit = fit[i]
            x, y = curr_fit[:, 0], curr_fit[:, 1]
            axes[i].scatter(x, y, color="green")
    else:
        for i in range(len(data)):
            curr_data = data[i]
            x, y = curr_data[:, 0], curr_data[:, 1]
            axes[i // cols][i % cols].scatter(x, y, color="red")

            curr_fit = fit[i]
            x, y = curr_fit[:, 0], curr_fit[:, 1]
            axes[i // cols][i % cols].scatter(x, y, color="green")

    plt.show()


def get_feature(x, degree):
    if degree <= 0:
        return x
    else:
        res = [np.ones_like(x)]
        for i in range(degree):
            res.insert(0, x ** (i + 1))
        return np.array(res).T


def fit_data(data, degree):
    x, y = data[:, 0], data[:, 1]
    x = get_feature(x, degree)
    w = least_square(x, y, feature=('linear' if degree == 0 else 'nonlinear'))

    pred_x = np.linspace(0, 10, len(data))
    pred_y = np.dot(get_feature(pred_x, degree), w)
    fit = np.array([pred_x, pred_y]).T

    return data, fit, w


def kfold_cross_validate(data, k, max_degree=5):
    np.random.shuffle(data)
    subset_sz = len(data) // k
    training_sets = [np.concatenate((data[:i*subset_sz], data[(i + 1)*subset_sz:])) for i in range(k)]
    validation_sets = [data[i*subset_sz:(i+1)*subset_sz] for i in range(k)]

    training_error = np.zeros(max_degree)
    validation_error = np.zeros(max_degree)

    for i in range(len(training_sets)):
        t_set = training_sets[i]
        v_set = validation_sets[i]
        for j in range(1, max_degree + 1):
            data, fit, w = fit_data(t_set, j)

            training_error[j - 1] += get_mse(get_feature(t_set[:, 0], j), t_set[:, 1], w)
            validation_error[j - 1] += get_mse(get_feature(v_set[:, 0], j), v_set[:, 1], w)

    training_error /= k
    validation_error /= k

    return training_error, validation_error


data = []
fits = []

###############################################################################
# Dataset 1 linear feature                                                    #
###############################################################################

d, fit, w = fit_data(d1, 0)
data.append(d), fits.append(fit)

###############################################################################
# Dataset 1 affine feature                                                    #
###############################################################################

d, fit, w = fit_data(d1, 1)
data.append(d), fits.append(fit)

###############################################################################
# Dataset 1 quadratic features                                                #
###############################################################################

d, fit, w = fit_data(d1, 2)
data.append(d), fits.append(fit)

###############################################################################
# Dataset 2 linear features                                                #
###############################################################################

d, fit, w = fit_data(d2, 0)
data.append(d), fits.append(fit)

###############################################################################
# Dataset 2 affine features                                                #
###############################################################################

d, fit, w = fit_data(d2, 1)
data.append(d), fits.append(fit)

###############################################################################
# Dataset 2 quadratic features                                                #
###############################################################################

d, fit, w = fit_data(d2, 2)
data.append(d), fits.append(fit)


plot_fit(data, fits, (2, 3))

train_error, val_error = kfold_cross_validate(d1, k=5, max_degree=5)
plt.scatter(np.arange(1, 6, 1), train_error, color="red")
plt.scatter(np.arange(1, 6, 1), val_error, color="blue")

plt.yscale("log")
plt.show()
print(train_error, val_error)



print("done")




