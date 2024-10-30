function y = CompositeSimpson(f, a, b, n)
h = (b - a) / n;
xI0 = f(a) + f(b);
xI1 = 0;
xI2 = 0;
for i=1:n-1
    x = a + i*h;
    if mod(i, 2) == 1
        xI1 = xI1 + f(x);
    else
        xI2 = xI2 + f(x);
    end
end
y = h * (xI0 + 2 * xI2 + 4 * xI1) / 3;
end
