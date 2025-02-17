import math


def f(x):
    return x + 1 - 2 * math.sin(math.pi * x)


def bisection(interval, f, tol):
    a, b = interval
    fa, fb = f(a), f(b)
    mid = (a + b) / 2
    if fa * fb < 0:
        fmid = f(mid)
        if abs(fmid) < tol:
            return mid
        if fmid * fa > 0:
            return bisection([mid, b], f, tol)
        else:
            return bisection([a, mid], f, tol)

    else:
        print(f"Bisection method invalid for given interval {interval}")
        return None


print(bisection([0, 0.5], f, 1e-5))
print("done")
