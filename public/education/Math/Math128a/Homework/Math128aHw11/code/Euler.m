function approx = Euler(f, init, a, b, N)
h = (b - a) / N;
t = a;
w = init;
approx = zeros(N + 1, 1);
approx(1) = w;

for i = 1:N
    approx(i + 1) = approx(i) + h * f(t, approx(i));
    t = a + i * h;
end

end
