function approx = TrapezoidNewton(f, dfy, init, a, b, N, tol, M)
h = (b - a) / N;
t = a;
w = init;
approx = zeros(N + 1, 1);
approx(1) = w;

for i = 1:N
    k1 = approx(i) + h * f(t, approx(i)) / 2;
    w0 = k1;
    j = 1;
    flag = 0;
    while flag == 0
        num = (w0 - h * f(t + h, w0) / 2 - k1);
        dem = (1 - h * dfy(t + h, w0) / 2);
        approx(i + 1) = w0 - num / dem;
        
        if abs(approx(i + 1) - w0) < tol
            flag = 1;
        else
            j = j + 1;
            w0 = approx(i + 1);
            if j > M
                break
            end
        end
    end
    t = a + i * h;
end

end
