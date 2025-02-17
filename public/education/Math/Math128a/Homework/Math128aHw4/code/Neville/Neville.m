function y_p = Neville(x, y, x_p)
    s = size(x);
    for i = 1:s
        y_new = zeros(s);
        for j = 1:(s - i)
            t1 = (x_p - x(i + j)) * y(i + j - 1);
            t2 = (x_p - x(i + j - 1)) * y(i + j);
            d = x(i + j) - x(i + j - 1);
            res = (t1 + t2) / d;
            y_new(i) = res;
        end
        y = y_new
    end
    y_p = y_new(end)
end