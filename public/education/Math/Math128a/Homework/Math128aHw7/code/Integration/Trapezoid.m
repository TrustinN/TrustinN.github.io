function y = Trapezoid(f, a, b, n)
y = 0;
h = (b - a) / n;
fX = f(a);
for i = 1:n
    newFX = f(a + i * h);
    y = y + h * (newFX + fX) / 2;
    fX = newFX;
end
end
