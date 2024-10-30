points = [[3, 6]; [2, 2]; [6, 6]; [5, 2]; [6.5, 3]];
lGP = [[3.3, 6.5]; [2.8, 3.0]; [5.8, 5.0]; [5.5, 2.2]];
rGP = [[2.5, 2.5]; [5.0, 5.8]; [4.5, 2.5]; [6.4, 2.8]];

coeff = BezierCurves(points, lGP, rGP);
polys = BezierPolys(coeff.x, coeff.y);

x = [];
y = [];
t = 0:0.01:1;
for i=1:size(points, 1) - 1
    xPoly = matlabFunction(polys.x(i));
    x = [x, xPoly(t)];
    yPoly = matlabFunction(polys.y(i));
    y = [y, yPoly(t)];
end
plot(x, y)


