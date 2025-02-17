out = newton(@myfunc1, 2.5, @out_error, 0.0002)
x = out.x
y = out.y
p_hat = out.p_hat
y_hat = out.y_hat
iter = size(x, 1)