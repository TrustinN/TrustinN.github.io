out = muller(@myfunc7, [-1; -.5; 0], 1e-5);
x = out.x
y = out.y
out = muller(@myfunc7, [-1; -2; -2.5], 1e-5);
x = out.x
y = out.y
out = muller(@myfunc7, [-1.2; -1.3; -1.4], 1e-5);
x = out.x
y = out.y