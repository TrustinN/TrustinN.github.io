syms s

f(s) = s * log(s + 1);
R = vpa(Romberg(f, -0.75, 0.75, 3))
