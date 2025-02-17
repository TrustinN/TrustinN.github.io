x = [0.0; 0.1; 0.3; 0.6; 1.0];
y = [-6.00000; -5.89483; -5.65014; -5.17788; -4.28172];
F = NewtonForwardDifference(x, y)
f = forwardPoly(x, F)
f = matlabFunction(f)