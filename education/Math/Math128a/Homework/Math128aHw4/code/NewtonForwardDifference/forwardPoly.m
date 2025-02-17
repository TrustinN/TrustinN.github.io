function f = forwardPoly(x, c)
    syms s;
    f = c(end);
    for i = 1:size(c)-1
        f = f * (s - x(end-i));
        f = f + c(end-i);
    end
end
