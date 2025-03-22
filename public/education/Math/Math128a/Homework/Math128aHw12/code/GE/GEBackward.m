function out = GEBackward(A)
n = size(A, 1);
out.flag = 0;

for i = 1:n-1
    p = -1;
    for j = i:n
        if A(j, i) ~= 0
            p = j;
            break
        end
    end
    if p == -1
        % no solution exists
        out.flag = 1;
        return;
    end
    
    if p ~= i
        % interchange
        tmp = A(i, :);
        A(i, :) = A(p, :);
        A(p, :) = tmp;
    end
    
    for j = i+1:n
        m = A(j, i) / A(i, i);
        A(j, :) = A(j, :) - m * A(i, :);
    end
end

if A(n, n) == 0
    out.flag = 1;
    return;
end

out.x = zeros(n, 1);
out.x(end) = A(n, n + 1) / A(n, n);
for i = n-1:-1:1
    out.x(i) = (A(i, n + 1) - dot(A(i, i+1:n), out.x(i+1:n))) / A(i, i);
end

end
