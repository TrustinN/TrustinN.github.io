x = [25.2; 49.2; 96.4; 119.4];
y = [0.25; 0.5; 1; 1.25];
c = NewtonForwardDifference(x, y)
f = forwardPoly(x, c)
f = diff(f);
f = matlabFunction(f)
s = double(f(119.4))