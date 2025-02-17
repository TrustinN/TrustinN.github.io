syms s

f(s) = s * log(s + 1);
res = vpa(double(CompositeTrapezoidal(f, -0.5, 0.5, 6)))
