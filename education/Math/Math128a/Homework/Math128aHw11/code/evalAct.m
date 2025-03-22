function actual = evalAct(funcs, a, b, N)
m = size(funcs, 2);
h = (b - a) / N;
actual = zeros(N + 1, m);

for j = 1:m
    t = a;
    currf = funcs{j};
    for i = 1:N + 1
        actual(i, j) = currf(t);
        t = a + i * h;
    end
end
