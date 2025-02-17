function out = Bezier(ep0, ep1, gp0, gp1)
x0 = ep0(1); y0 = ep0(2); x1 = ep1(1); y1 = ep1(2);
xp = gp0(1); yp = gp0(2); xn = gp1(1); yn = gp1(2);
out.x = [x0, 3 * (xp - x0), 3 * (x0 + xn - 2 * xp), x1 - x0 + 3 * (xp - xn)];
out.y = [y0, 3 * (yp - y0), 3 * (y0 + yn - 2 * yp), y1 - y0 + 3 * (yp - yn)];
end
