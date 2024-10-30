function polys = BezierPolys( xCoeff, yCoeff )
syms s;
polys.x = [];
polys.y = [];
for i=1:size(xCoeff, 1)
    xc = xCoeff(i, :);
    polys.x = [polys.x; xc(1) + xc(2) * s + xc(3) * s^2 + xc(4) * s^3];
    yc = yCoeff(i, :);
    polys.y = [polys.y; yc(1) + yc(2) * s + yc(3) * s^2 + yc(4) * s^3];
end
end
