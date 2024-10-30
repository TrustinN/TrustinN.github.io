from align import color_align
import skimage as sk
import os
from img_io import DataIO


# Set the input as the directory to the image that is read in
input = "/path/to/input"

# Set the output as the directory where the images will be saved
output = "/path/to/output"

save_data = DataIO(os.path.join(output, "data.txt"))

# Uncomment this line to batch process images in the input directory
# color_align(input, output, io=save_data, metric="ncc", filter=sk.filters.sobel)

# Uncomment the following two lines to choose which image in the input directory to process
# imname = "cathedral.jpg"
# color_align(os.path.join(input, imname), output, io=save_data, metric="ncc", filter=sk.filters.sobel)

# Write runtime data to data.txt file
save_data.write_data()
save_data.close_file()
