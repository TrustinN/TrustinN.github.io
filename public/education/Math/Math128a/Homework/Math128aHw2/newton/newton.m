function x = newton(f, p0, metric, tol, x_true)
    if ~exist('x_true')
        x_true = 0;
    end
    x = p0;
    syms c;
    df = matlabFunction(diff(f(c), c));
    while 1
        if metric(x, x_true, f) < tol
            break;
        end
        x = x - f(x) / df(x);
    end

end