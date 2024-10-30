syms s
f(s) = exp(0.1*s^2);
df = diff(f, s);

x = [1; 2; 3];
y = double(f(x));
dy = double(df(x));
coeff = Hermite(x, y, dy);
P = matlabFunction(forwardPoly(x, coeff, 5));
res = vpa(P(1.25))
actual = vpa(f(1.25))
err = abs(res - actual)