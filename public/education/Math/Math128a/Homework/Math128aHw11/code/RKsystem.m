function approx = RKsystem(funcs, init, a, b, N)
m = size(funcs, 2);
h = (b - a) / N;
t = a;
approx = zeros(N + 1, m);
% rows of approx represent the different approximations at time t
% for each function

for j = 1:m
    approx(1, j) = init(j);
end

k = zeros(4, m);

for i = 1:N
    for j = 1:m
        currf = funcs{j};
        k(1, j) = h * currf(t, approx(i, :));
    end
    
    for j = 1:m
        currf = funcs{j};
        k(2, j) = h * currf(t + h / 2, approx(i, :) + k(1, :) / 2);
    end
    
    for j = 1:m
        currf = funcs{j};
        k(3, j) = h * currf(t + h / 2, approx(i, :) + k(2, :) / 2);
    end
    
    for j = 1:m
        currf = funcs{j};
        k(4, j) = h * currf(t + h, approx(i, :) + k(3, :));
    end
    
    for j = 1:m
        approx(i + 1, j) = approx(i, j) + (k(1, j) + 2 * k(2, j) + 2 * k(3, j) + k(4, j)) / 6;
    end
    
    t = a + i * h;
end

end
