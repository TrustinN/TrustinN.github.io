function out = steffensen(f, p, tol)
    out.x = [p];
    out.y = [f(p)];
    while 1
        p0 = f(p);
        p1 = f(p0);
        aitk = Aitken([p, p0, p1]);
        out.x = [out.x; vpa(aitk)];
        out.y = [out.y; vpa(f(aitk))];
        if abs(p - aitk) < tol
            break
        end
        p = aitk;
    end
    
end