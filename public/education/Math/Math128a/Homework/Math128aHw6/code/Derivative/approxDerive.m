function out = approxDerive(f, x, h, n)
out = zeros(n, 1);
out(1) = ThreePointEndpoint(f, x, h);
x = x + h;
for i=2:n-1
    out(i) = ThreePointMidpoint(f, x, h);
    x = x + h;
end
out(end) = ThreePointEndpoint(f, x, -h);
end
