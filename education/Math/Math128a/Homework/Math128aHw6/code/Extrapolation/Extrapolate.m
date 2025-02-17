function res = Extrapolate(initial)
sz = size(initial, 1);
res = zeros(sz, sz);
res(:, 1) = initial;
for i = 2:sz
    for j = 2:i
        res(i, j) = res(i, j - 1) + (res(i, j - 1) - res(i - 1, j - 1)) / (4^(j - 1) - 1);
    end
end
end