syms s

sigma = 1;
mean = 0;
f(s) = exp(-.5 * (s/sigma)^2) / (sigma * (2 * pi)^(.5));

res = [0;0;0];
n = 10;
for i = 1:3
    res(i) = vpa(double(CompositeSimpson(f, -i*sigma, i*sigma, n)))
end

