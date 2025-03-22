syms x;
f(x) = sin(1 / x);

app = vpa(Simpson(f, 0.00001, 2, 10e-3, 10))

g(x) = cos(1 / x);
app = vpa(Simpson(g, 0.00001, 2, 10e-3, 10))
