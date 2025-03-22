funcs = {@q1f1, @q1f2};
init = [-3, 5];

approx = RKsystem(funcs, init, 0, 2, 10)
