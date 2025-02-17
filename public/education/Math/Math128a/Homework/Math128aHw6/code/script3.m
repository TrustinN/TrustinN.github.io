syms s;

f(s) = s + exp(s);
cols = 4;
h = 0.4;
numIter = 2^(cols - 1);
approx = approxDerive(f, h, -h / numIter, numIter);
indices = zeros(cols, 1);
indices(end) = numIter;
for i=2:cols
    numIter = numIter - 2^(i - 2);
    indices(end-i+1) = numIter;
end
approx = approx(indices);

ex = Extrapolate(approx)
