function y = ThreePointMidpoint(f, x, h)
y = (f(x + h) - f(x - h)) / (2 * h);
end
