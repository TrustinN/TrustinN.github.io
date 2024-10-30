function x = fixed_point(f, h, p0, tol)

x = p0;
while 1
    x = x - h * f(x);
    if abs(f(x)) < tol
        break
    end

end