out = steffensen(@myfunc3, 1.5, 1e-4);
x = out.x
y = out.y
x_res = y(end:end);
y_res = x_res^3 - x_res - 1