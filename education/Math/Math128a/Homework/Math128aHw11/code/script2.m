funcs = {@q2f1, @q2f2};
init = [4, 3];

approx = RKsystem(funcs, init, 1, 3, 10)

actFuncs = {@q2actf1};
actual = evalAct(actFuncs, 1, 3, 10)
