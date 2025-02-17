function x = secant(f, p0, tol)
    x = f(p0);
    while 1
        if abs(f(x)) < tol
            break;
        end
        x_new = f(x);
        inv_df = (x - p0) / (x_new - x);
        x = x - x_new * inv_df;
    end
end