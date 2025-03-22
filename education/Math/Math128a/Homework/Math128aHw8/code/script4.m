syms x;

m = 1; k = 9; F0 = 1; w = 2;
w0 = sqrt(k / m);

t = 0:0.1:2*pi;

u(x) = (F0 / (m * (w0^2 - w^2))) * (cos(w * x) - cos(w0 * x));
app = vpa(Simpson(u, 0, 2 * pi, 10e-4, 10))
