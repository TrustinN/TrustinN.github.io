syms x;

c = .0001:.01:2;
f(x) = sin(1 / x);
plot(c, f(c));
f(x) = cos(1/x);
plot(c, f(c));

