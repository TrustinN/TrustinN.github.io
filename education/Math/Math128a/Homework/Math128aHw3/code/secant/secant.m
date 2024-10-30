function out = secant(f, p0, p1, tol)
    y0 = f(p0);
    y1 = f(p1);
    out.x = [vpa(p0); vpa(p1)];
    iter = 1;
    while 1
        if abs(y0 - y1) < tol
            break;
        end
        inv_df = (p1 - p0) / (y1 - y0);
        x = out.x(end) - y1 * inv_df;
        out.x = [out.x; vpa(x)];
        p0 = p1;
        p1 = x;
        y0 = y1;
        y1 = f(x);
        iter = iter + 1;
    end
end