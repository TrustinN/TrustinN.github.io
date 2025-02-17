import matplotlib.pyplot as plt
import numpy as np
import pyvista as pv
import skimage.io as skio

from homography import applyH, computeH, warpImage

img_path = "../data/sjerome.jpg"
im = skio.imread(img_path)
im_h, im_w, c = im.shape

plt.imshow(im)
tr, bl, v = np.array(plt.ginput(n=3, timeout=-1))

# from top right going counter clockwise
w, h = bl - tr
inner_rectangle = []
for i in range(4):
    inner_rectangle.append(tr + np.array([w * (i > 1), h * (0 < i and i < 3)]))

# recover perspective lines
a = np.tile(v, (4, 1))
b = np.array(inner_rectangle)


# intersection between line (p1, p2), (p3, p4)
def find_intersect(p1, p2, p3, p4):
    m1 = p1 - p2
    m2 = p4 - p3

    b = p4 - p2

    A = np.array([m1, m2]).T
    t = np.linalg.solve(A, b)

    return t[0] * m1 + p2


# get the lines defining the outer rectangle
lines_a = []
lines_b = []
for i in range(4):
    lines_a.append(np.array([im_w * (i > 1), im_h * (0 < i and i < 3)]))
    j = (i + 1) % 4
    lines_b.append(np.array([im_w * (j > 1), im_h * (0 < j and j < 3)]))

# print(lines_a)
# print(lines_b)

# determine intersections of perspective lines with the image boundaries

i1 = find_intersect(a[0], b[0], lines_a[0], lines_b[0])
outer_rectangles = [i1]
# compute intersections counter clockwise
for i in range(1, 5):
    i = i % 4
    i1 = find_intersect(a[i], b[i], lines_a[i], lines_b[i])
    j = (i - 1) % 4
    i2 = find_intersect(a[i], b[i], lines_a[j], lines_b[j])
    # find which one is more aligned with the previous intersection

    prev = outer_rectangles[-1]
    align_i1 = np.min(np.abs(prev - i1))
    align_i2 = np.min(np.abs(prev - i2))
    if align_i1 < align_i2:
        outer_rectangles.append(i1)
        outer_rectangles.append(i2)
    else:
        outer_rectangles.append(i2)
        outer_rectangles.append(i1)

outer_rectangles.append(find_intersect(a[0], b[0], lines_a[-1], lines_b[-1]))
outer_rectangles = np.array(outer_rectangles)

planes = []
for i in range(4):
    plane = np.array(
        [
            inner_rectangle[i],
            outer_rectangles[2 * i],
            outer_rectangles[2 * i + 1],
            inner_rectangle[(i + 1) % 4],
        ]
    )
    planes.append(plane)
planes.append(np.array(inner_rectangle))


# l1, l3 denote the parallel lines and the corner of the plane
def find_ratio(l1, l2, l3, axis, threshold=1e-4):
    #    ________
    #   |    |   ________
    #   |    |           ________
    #   |    |                   |
    #   |    |                   |
    #   |    |                   |
    #   |    |                   |
    #   |    |                   |
    #   |    |        ____________
    #   | ___________
    #   l3   l2                 l1
    #   |____|<-ratio

    if abs(l3[0][axis] - l2[0][axis]) < threshold:
        return 1

    ratio = 1
    main_diagonal = np.array([l1[0], l3[1]])
    sub_diagonal = np.array([l1[1], l3[0]])
    sd_axis = -np.inf
    while l2[0][axis] - sd_axis > threshold:
        ratio += 1
        sd_axis = find_intersect(
            main_diagonal[0], main_diagonal[1], sub_diagonal[0], sub_diagonal[1]
        )[axis]
        division = None
        if axis == 0:
            division = np.array([[sd_axis, 0], [sd_axis, 1000]])
        else:
            division = np.array([[0, sd_axis], [1000, sd_axis]])
        isd = find_intersect(l1[1], l3[1], division[0], division[1])
        sub_diagonal = np.array([l3[0], isd])

    if l2[0][axis] - sd_axis < 0:
        return (1 / ratio + 1 / (ratio - 1)) / 2

    return 1 / ratio


# plane is a counter clockwise oriented list of points
# axis is 1 for horizontal, 0 for vertical
# point is assumed to lie on one of the plane's lines
# plane 3d is the 3d point corresponding to each point in plane
def compute_coordinate(point, plane, plane3d, axis):
    bounds = (np.min(plane[:, axis]), np.max(plane[:, axis]))
    in_plane = bounds[0] < point[axis] and point[axis] < bounds[1]

    # compute extra line
    b = point
    a = point + axis * np.array([1, 0]) + (1 - axis) * np.array([0, 1])
    i1 = find_intersect(plane[0], plane[1], a, b)
    i2 = find_intersect(plane[2], plane[3], a, b)
    l1, l2, l3 = np.array([plane[0], plane[-1]]), None, None

    # sort the lines
    if in_plane:
        l2 = np.array([i1, i2])
        l3 = np.array([plane[1], plane[2]])
    else:
        l3 = np.array([plane[1], plane[2]])
        l2 = np.array([i1, i2])

    ratio = find_ratio(l1, l2, l3, axis)
    if ratio == 1:
        ratio = 1
    elif in_plane:
        ratio = 1 - ratio
    else:
        ratio = 1 / (1 - ratio)

    # find out which line it is on
    m1 = plane[0] - plane[1]
    m2 = plane[3] - plane[2]

    m1_p = plane[0] - point
    m2_p = plane[3] - point

    err1 = abs(m1_p[0] / m1_p[1] - m1[0] / m1[1])
    err2 = abs(m2_p[0] / m2_p[1] - m2[0] / m2[1])

    if err1 < err2:
        return ratio * (plane3d[1] - plane3d[0]) + plane3d[0]
    else:
        return ratio * (plane3d[2] - plane3d[3]) + plane3d[3]


def plot_plane(plane):
    plt.plot(
        np.concatenate((plane[:, 0], np.array([plane[0, 0]])), axis=0),
        np.concatenate((plane[:, 1], np.array([plane[0, 1]])), axis=0),
    )


#   z ^
#     |
#     |
#     |_______> y
#    /
#   /
#  < x


scale = 1
bottom_plane_3d = (
    np.array(
        [
            np.array([0, 0, 0]),
            np.array([1, 0, 0]),
            np.array([1, 1, 0]),
            np.array([0, 1, 0]),
        ]
    )
    * scale
)


# recover 3d coordinates for all planes
def compute_3d(planes, base_3d, middle_plane):
    # we go in the order specified in the paper, computing the 3d points for
    # - bottom plane
    # - middle plane
    # - left plane
    # - right plane
    # - top plane

    left, bottom, right, top, middle = planes

    # height between base plane and top plane
    middle_height = np.linalg.norm(middle_plane[0] - middle_plane[1])
    middle_width = np.linalg.norm(middle_plane[1] - middle_plane[2])
    W = np.linalg.norm(base_3d[1] - base_3d[2])
    H = middle_height / middle_width * W
    # figure out the middle plane first
    m_plane = [
        base_3d[0] + np.array([0, 0, H]),
        base_3d[0],
        base_3d[0] + np.array([0, W, 0]),
        base_3d[0] + np.array([0, W, H]),
    ]
    l_anchor = compute_coordinate(left[2], bottom, base_3d, axis=1)
    l_plane = [m_plane[0], l_anchor + np.array([0, 0, H]), l_anchor, m_plane[1]]

    r_anchor = compute_coordinate(right[1], bottom, base_3d, axis=1)
    r_plane = [m_plane[2], r_anchor, r_anchor + np.array([0, 0, H]), m_plane[3]]

    t_anchor = compute_coordinate(top[1], right, r_plane, axis=0)
    t_plane = [m_plane[3], t_anchor, t_anchor + np.array([0, -W, 0]), m_plane[0]]

    return np.array([l_plane, base_3d, r_plane, t_plane, m_plane])


def get_aspect_ratios(coords_3d):
    # order:
    # - bottom plane
    # - left plane
    # - right plane
    # - top plane
    # - middle plane
    aspects = []
    for i in range(len(coords_3d)):
        cur_plane = coords_3d[i]
        a1 = np.linalg.norm(cur_plane[0] - cur_plane[1])
        a2 = np.linalg.norm(cur_plane[1] - cur_plane[2])
        aspects.append(np.array([a1, a2]))

    return np.array(aspects)


def initialize_canvas(middle_plane, aspect_ratios):
    # want to initialize the corners of the canvas that the homography will map on
    # for each plane in their counter clockwise orientations
    # order:
    # - bottom plane
    # - left plane
    # - right plane
    # - top plane
    # - middle plane

    # the middle plane will be kept in the middle of the image
    middle_width = np.linalg.norm(middle_plane[1] - middle_plane[2])
    lengths = aspect_ratios * middle_width
    dir1 = np.array([-1, 0])
    dir2 = np.array([0, 1])
    rot_c90 = np.array([[0, 1], [-1, 0]])
    canvases = []
    for i in range(len(lengths) - 1):
        lx, ly = lengths[i]
        canvas = [
            middle_plane[i],
            middle_plane[i] + dir1 * lx,
            middle_plane[i] + dir1 * lx + dir2 * ly,
            middle_plane[i] + dir2 * ly,
        ]
        canvases.append(canvas)
        dir1 = rot_c90 @ dir1
        dir2 = rot_c90 @ dir2

    canvases.append(middle_plane)

    return np.array(canvases)


def pad_image(im, dx, dy):
    """
    Zero pads image to move image by displacement provided
    """
    dx = int(dx)
    dy = int(dy)
    if dx > 0:
        zeros = np.zeros((int(im.shape[0]), dx, 3), dtype=np.uint8)
        im = np.concatenate((zeros, im), axis=1)
    else:
        im = im[:, abs(dx) :, :]

    if dy > 0:
        zeros = np.zeros((dy, int(im.shape[1]), 3), dtype=np.uint8)
        im = np.concatenate((zeros, im), axis=0)
    else:
        im = im[abs(dy) :, :, :]

    return im


def warp_to_canvas(img, plane, canvas):
    # # if plane goes out of bounds, we need to pad
    offset_x = -np.min(plane[:, 0])
    offset_y = -np.min(plane[:, 1])
    offsets = np.tile([offset_x, offset_y], (len(plane), 1))
    new_plane = plane + offsets
    new_canvas = canvas + offsets
    input_im = pad_image(img, offset_x, offset_y)
    # extract image
    max_x = np.max(plane[:, 0])
    max_y = np.max(plane[:, 1])

    input_im = input_im[: int(max_y), : int(max_x), :]
    plt.imshow(input_im)
    plot_plane(new_plane)
    plot_plane(new_canvas)
    plt.show()

    H = computeH(new_plane, new_canvas)
    warped_im, dxy, new_corners = warpImage(input_im, H)
    warped_im = pad_image(warped_im, -offset_x, -offset_y)
    offsets = np.tile(dxy, (len(plane), 1))
    # print(canvas)
    # print(canvas + offsets)
    plt.imshow(warped_im.astype(np.uint8))
    plot_plane(canvas)
    plt.show()
    return warped_im.astype(np.uint8), dxy


coords_3d = compute_3d(planes, bottom_plane_3d, inner_rectangle)
aspect_ratios = get_aspect_ratios(coords_3d)
canvases = initialize_canvas(inner_rectangle, aspect_ratios)

off_x = -np.min(canvases[:, :, 0])
off_y = -np.min(canvases[:, :, 1])
max_x = np.max(canvases[:, :, 0])
max_y = np.max(canvases[:, :, 1])
mosaic = np.zeros((int(max_y + off_y), int(max_x + off_x), 3), np.uint8)

offsets = np.tile([off_x, off_y], (4, 1))
textures = []
for i in range(5):
    plt.imshow(im)
    plt.show()
    warped, dxy = warp_to_canvas(im, planes[i], canvases[i])
    # adjust the canvas to fit on the mosaic
    global_canv = canvases[i] + offsets
    global_frame = pad_image(warped, off_x - dxy[0], off_y - dxy[1])

    global_canv_min_x = int(np.min(global_canv[:, 0]))
    global_canv_max_x = min(int(np.max(global_canv[:, 0])), global_frame.shape[1])
    global_canv_min_y = int(np.min(global_canv[:, 1]))
    global_canv_max_y = min(int(np.max(global_canv[:, 1])), global_frame.shape[0])

    texture = global_frame[
        global_canv_min_y:global_canv_max_y, global_canv_min_x:global_canv_max_x, :
    ]

    mosaic[
        global_canv_min_y:global_canv_max_y, global_canv_min_x:global_canv_max_x, :
    ] = texture

    textures.append(texture)

    plt.imshow(mosaic)
    plot_plane(global_canv)
    plt.show()

faces = np.array([4, 0, 1, 2, 3])
# Define texture coordinates (UV mapping)
# texture_coords = np.array(
#     [
#         [0, 0],  # Corresponds to bottom-left of the texture
#         [1, 0],  # Corresponds to bottom-right of the texture
#         [1, 1],  # Corresponds to top-right of the texture
#         [0, 1],  # Corresponds to top-left of the texture
#     ]
# )

plotter = pv.Plotter()
for i in range(len(coords_3d)):
    points_3d = coords_3d[i]
    plane = pv.PolyData(points_3d, faces)
    tx = pv.numpy_to_texture(textures[i])
    if i != 4:
        plane.texture_map_to_plane(
            origin=points_3d[(2 - i) % 4],
            point_u=points_3d[(3 - i) % 4],
            point_v=points_3d[(1 - i) % 4],
            inplace=True,
        )
    else:
        plane.texture_map_to_plane(
            inplace=True,
        )
    # if i == 0:
    #     plane.texture_map_to_plane(
    #         origin=points_3d[2],
    #         point_u=points_3d[3],
    #         point_v=points_3d[1],
    #         inplace=True,
    #     )
    # elif i == 1:
    #     plane.texture_map_to_plane(
    #         origin=points_3d[1],
    #         point_u=points_3d[2],
    #         point_v=points_3d[0],
    #         inplace=True,
    #     )
    # elif i == 2:
    #     plane.texture_map_to_plane(
    #         origin=points_3d[0],
    #         point_u=points_3d[1],
    #         point_v=points_3d[3],
    #         inplace=True,
    #     )
    # elif i == 3:
    #     plane.texture_map_to_plane(
    #         origin=points_3d[3],
    #         point_u=points_3d[0],
    #         point_v=points_3d[2],
    #         inplace=True,
    #     )
    # elif i == 4:
    #     plane.texture_map_to_plane(
    #         origin=points_3d[1],
    #         point_u=points_3d[2],
    #         point_v=points_3d[0],
    #         inplace=True,
    #     )

    plane.compute_normals(inplace=True)

    plotter.add_mesh(plane, texture=tx)

plotter.show()


# plt.imshow(im)
# for i in range(4):
#     plot_plane(planes[i])
#     plot_plane(canvases[i])
# plt.show()


# print(np.array(inner_rectangle))
print("done")
