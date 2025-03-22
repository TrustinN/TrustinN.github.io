function y = q1f1(t, funcs)
% funcs is the function evaluations of the other functions
y = funcs(1) / 9 - 2 * funcs(2) / 3 - t^2 / 9 + 2 / 3;
end
