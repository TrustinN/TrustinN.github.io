function f = Hermite(x, y, dy)
    sz = size(x, 1);

    p = zeros(2 * sz, 2*sz + 1);
    p(1:2:end, 1) = x;
    p(2:2:end, 1) = x;
    p(1:2:end, 2) = y;
    p(2:2:end, 2) = y;
    p(1:2:end, 3) = dy;
    p(2:2:end, 3) = dy;
    p(1, 3) = 0.0;

    dup_x = p(:, 1);
    for i = 1:sz-1
        p(2*i+1, 3) = (p(2*i+1, 2) - p(2*i, 2)) / (dup_x(2*i+1) - dup_x(2*i));
    end

    for i = 3:2*sz
        for j = 3:i
            p(i, j+1) = (p(i, j) - p(i-1, j)) / (dup_x(i) - dup_x(i-j+1));
        end
    end
    
    f = zeros(2*sz, 1);
    for i = 1:2*sz
        f(i) = p(i, i+1);
    end
    
end