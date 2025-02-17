function p = bisection(f, a, b, t)

while 1
    p = (a + b) / 2;
    if abs(f(p)) < t, break; end
    if f(a) * f(p) > 0
        a = p;
    else
        b = p;
    end
end

end