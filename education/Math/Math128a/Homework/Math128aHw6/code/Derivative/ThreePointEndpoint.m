function y = ThreePointEndpoint(f, x, h)
y = (-3 * f(x) + 4 * f(x + h) - f(x + 2 * h)) / (2 * h);
end
