function y = CompositeTrapezoidal(f, a, b, n)
h = (b - a) / n;
xI0 = f(a) + f(b);
xI1 = 0;
for i = 1:n-1
    x = a + i * h;
    xI1 = xI1 + f(x);
end
y = h * (xI0 + 2 * xI1) / 2;
end
