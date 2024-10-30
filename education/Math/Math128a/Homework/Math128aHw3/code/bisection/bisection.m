function out = bisection(f, a, b, t)
out.x = [];
while 1
    p = (a + b) / 2;
    out.x = [out.x; vpa(p)];
    if abs(f(p)) < t, break; end
    if f(a) * f(p) > 0
        a = p;
    else
        b = p;
    end
end

end