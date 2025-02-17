function f = NewtonForwardDifference(x, y)
    sz = size(x, 1);
    p = zeros(sz);
    p(:, 1) = y;
    for i = 2:size(x)
        for j = 2:i
            p(i, j) = (p(i, j-1) - p(i-1, j-1)) / (x(i) - x(i-j+1));
        end
    end
    f = zeros(sz, 1);
    for i = 1:sz
        f(i) = p(i, i);
    end
    
end