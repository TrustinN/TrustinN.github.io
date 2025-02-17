out = newton(@myfunc5, -3, @out_error, 1e-5);
x = out.x
y = out.y