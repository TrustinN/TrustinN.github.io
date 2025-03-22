syms x
f(x) = (6 * cos(4 * x) + 4 * sin(6 * x)) * exp(x);

app = vpa(Simpson(f, 0, pi / 2, 10e-5, 10))
