x = [0.0; 0.2; 0.4; 0.6];
y = [15.0; 21.0; 30.0; 51.0];
y_err = [15.0; 21.0; 20.0; 56.0];

c1 = NewtonForwardDifference(x, y);
f_true = matlabFunction(forwardPoly(x, c1));
a1 = f_true(0.3);

c2 = NewtonForwardDifference(x, y_err);
f_err = matlabFunction(forwardPoly(x, c2));
a2 = f_err(0.3);

err = a2 - a1