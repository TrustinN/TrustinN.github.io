function coeff = quad_coeff(f, x)
    fx = arrayfun(f, x);
    diff = x - [x(2:end); x(1)];
    diff_fx = fx - [fx(2:end); fx(1)];

    denom = prod(diff);

    coeff.c = f(x(3));
    coeff.b = (-diff(end)^2 * diff_fx(2) - diff(2)^2 * diff_fx(end)) / denom;
    coeff.a = (diff(2) * diff_fx(end) - diff(end) * diff_fx(2)) / denom;
end

