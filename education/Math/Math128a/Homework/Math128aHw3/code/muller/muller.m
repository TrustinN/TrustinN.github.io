function out = muller(f, x, tol)
    out.x = x;
    out.y = arrayfun(f, x);

    while 1
        cf = quad_coeff(f, out.x(end-2:end));
        a = cf.a; b = cf.b; c = cf.c;
        p3 = 0;
        if sign(b) == 1
            p3 = out.x(end) - (2*c) / (b + sqrt(b^2 - 4*a*c));
        else
            p3 = out.x(end) - (2*c) / (b - sqrt(b^2 - 4*a*c));
        end
        out.x = [out.x; vpa(p3)];
        out.y = [out.y; f(p3)];
        if norm(out.y(end)) < tol
            break
        end
    end
end

