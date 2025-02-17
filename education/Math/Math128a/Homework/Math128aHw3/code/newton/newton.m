function out = newton(f, p0, metric, tol, x_true)
    if ~exist('x_true')
        x_true = 0;
    end
    digits(10)
    x = p0;
    out.x = [vpa(p0)];
    out.p_hat = [];
    out.y = [vpa(f(p0))];
    out.y_hat = [];
    syms c;
    df = matlabFunction(diff(f(c), c));
    i = 1;
    while 1
        if metric(x, x_true, f) < tol
            break;
        end
        x = x - f(x) / df(x);
        out.x = [out.x; vpa(x)];
        i = i + 1;
        if i >= 3
            p_n = vpa(Aitken(out.x(end-2:end)));
            out.p_hat = [out.p_hat; p_n];
            out.y_hat = [out.y_hat; f(p_n)];
        end
        out.y = [out.y; vpa(f(x))];
    end

end