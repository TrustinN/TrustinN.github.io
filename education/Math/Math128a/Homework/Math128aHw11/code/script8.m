approx = TrapezoidNewton(@q5f, @q5fdy, exp(1), 0, 1, 10, 10e-5, 100)
actual = evalActStiff(@q5actf, 0, 1, 10)
