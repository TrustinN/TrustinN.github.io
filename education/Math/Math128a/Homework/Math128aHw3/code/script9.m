syms r;
f(r) = 2*pi*(r + 0.25)^2 + 1000*(.25 + 2*pi*r) / (pi*r^2);
df = matlabFunction(diff(f, r));

out = newton(df, 3, @out_error, 1e-4);
x = out.x(end)
y = double(subs(f, r, x))