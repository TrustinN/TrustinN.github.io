function R = Romberg(f, a, b, n)
h = b - a;
R = zeros(2, n);
R(1, 1) = h/2 * (f(a) + f(b));
for i = 2:n
    s = 0;
    for k = 1:2^(i - 2)
        s = s + f(a + (k - 0.5) * h);
    end
    R(2, 1) = (R(1, 1) + h * s) / 2;
    
    for j = 2:i
        numerator = R(2, j - 1) - R(1, j - 1);
        denominator = 4^(j - 1) - 1;
        R(2, j) = R(2, j - 1) + numerator / denominator;
    end
    
    h = h / 2;
    R(1, :) = R(2, :);
end
end
