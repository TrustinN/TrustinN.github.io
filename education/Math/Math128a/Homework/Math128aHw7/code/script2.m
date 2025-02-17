syms s;

f(s) = s * log(s + 1);
res = vpa(double(Simpson(f, -0.5, 0)))
