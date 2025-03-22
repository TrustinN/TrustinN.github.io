function out = GEPP(A)
n = size(A, 1);
NROW = 1:n;
out.flag = 0;
out.x = zeros(n, 1);

for i = 1:n-1
    p = -1;
    m_p = -inf();
    for j = i:n
        if abs(A(NROW(j), i)) > m_p
            p = j;
            m_p = abs(A(NROW(j), i));
        end
    end
    
    if A(NROW(p), i) == 0
        out.flag = 1;
        return
    end
    
    if NROW(i) ~= NROW(p)
        NCOPY = NROW(i);
        NROW(i) = NROW(p);
        NROW(p) = NCOPY;
    end
    
    for j = i+1:n
        m = A(NROW(j), i) / A(NROW(i), i);
        A(NROW(j), :) = A(NROW(j), :) - m * A(NROW(i), :);
    end
    
end

if A(NROW(n), n) == 0
    out.flag = 1;
    return
end

out.x(n) = A(NROW(n), n + 1) / A(NROW(n), n);

for i = n-1:-1:1
    num = A(NROW(i), n + 1) - dot(A(NROW(i), i+1:n), out.x(i+1:n));
    dom = A(NROW(i), i);
    out.x(j) = num / dom;
end

end
