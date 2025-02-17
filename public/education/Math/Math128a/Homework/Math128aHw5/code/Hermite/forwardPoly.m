function f = forwardPoly(x, c, d)
    syms s;
    f = c(d);
    new_x = zeros(2*size(x, 1), 1);
    new_x(1:2:end) = x;
    new_x(2:2:end) = x;
    x = new_x;
    for i = 1:d+1
        f = f * (s - x(d-i+2));
        f = f + c(d-i+2);
    end
end
