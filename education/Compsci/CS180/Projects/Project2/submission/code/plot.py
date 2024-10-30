from matplotlib import pyplot as plt


def show_plots(axis=0, *args):
    fig = plt.figure(figsize=(8, 8))

    if axis == 0:
        height = len(args[0])
        length = len(args)
        for j in range(height):
            for i in range(length):
                img = args[i][j]
                ax = fig.add_subplot(height, length, length * j + i + 1)
                ax.set_aspect('equal')
                ax.axis('off')
                plt.imshow(img)

    else:
        height = len(args)
        length = len(args[0])
        for j in range(height):
            for i in range(length):
                img = args[j][i]
                ax = fig.add_subplot(height, length, length * j + i + 1)
                ax.set_aspect('equal')
                ax.axis('off')
                plt.imshow(img)
                img = args[j][i]

    fig.subplots_adjust(wspace=.1, hspace=.1)
    plt.show()
    plt.close()
