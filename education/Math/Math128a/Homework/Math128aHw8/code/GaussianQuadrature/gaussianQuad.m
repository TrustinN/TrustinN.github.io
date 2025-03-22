function app = gaussianQuad(f, a, b, n)
% Change of variables to integration on [-1, 1]
syms t;
CoV = ((b - a) * t + (b + a)) / 2;
g(t) = f(CoV);

L = [t, t^2 - 1/3, t^3 - 3 * t / 5, t^4 - 6 * t^2 / 7 + 3 / 35];
coeff = coeffs(L(n), "All");
r = roots(coeff);
c = zeros(size(r, 1), 1);
for i = 1:n
    h(t) = t / t;
    for j = 1:n
        if j ~= i
            h(t) = h(t) * (t - r(j)) / (r(i) - r(j));
        end
    end
    c(i) = int(h, -1, 1);
end

app = 0;
for i = 1:n
    app = app + c(i) * g(r(i));
end
app = app * (b - a) / 2;

end
