function actual = evalActStiff(f, a, b, N)
h = (b - a) / N;
t = a;
actual = zeros(N + 1, 1);
for i = 1:N + 1
    actual(i) = f(t);
    t = a + i * h;
end

end
