syms s;

f(s) = 2 * exp(-(s)^2) / (sqrt(pi));

res = vpa(double(Romberg(f, 0, 1, 10)))
