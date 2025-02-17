syms s

f(s) = s * log(s + 1);
res = vpa(double(CompositeSimpson(f, -0.5, 0.5, 6)))
