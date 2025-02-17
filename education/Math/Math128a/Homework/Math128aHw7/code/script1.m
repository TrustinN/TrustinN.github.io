syms s;

f(s) = s * log(s + 1);
res = vpa(double(Trapezoid(f, -0.5, 0, 2)))
