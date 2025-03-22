function approx = RKfourth(f, init, a, b, N)
h = (b - a) / N;
t = a;
w = init;
approx = zeros(N + 1, 1);
approx(1) = w;

for i = 1:N
    
    k1 = h * f(t, approx(i));
    k2 = h * f(t + h / 2, approx(i) + k1 / 2);
    k3 = h * f(t + h / 2, approx(i) + k2 / 2);
    k4 = h * f(t + h, approx(i) + k3);
    
    approx(i + 1) = approx(i) + (k1 + 2 * k2 + 2 * k3 + k4) / 6;
    t = a + i * h;
end

end
