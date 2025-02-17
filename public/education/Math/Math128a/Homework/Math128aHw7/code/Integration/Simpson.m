function y = Simpson(f, a, b)
x1 = (a + b) / 2;
h = x1 - a;
y = (h / 3) * (f(a) + 4 * f(x1) + f(b));
end
