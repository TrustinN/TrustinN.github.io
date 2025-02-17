function out = BezierCurves( points, lGP, rGP)
out.x = [];
out.y = [];
for i = 1:size(points, 1) - 1
    coeff = Bezier(points(i, :), points(i + 1, :), lGP(i, :), rGP(i, :));
    out.x = [out.x; coeff.x];
    out.y = [out.y; coeff.y];
end
end
