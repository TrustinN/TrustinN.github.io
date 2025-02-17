syms s
f(s) = 3*s*exp(s) - exp(2*s);
df = diff(f, s);

x = [1; 1.05];
y = double(f(x));
dy = double(df(x));
coeff = Hermite(x, y, dy);
P = matlabFunction(forwardPoly(x, coeff, 3));
res = vpa(P(1.03))
actual = vpa(f(1.03))
err = abs(res - actual)
