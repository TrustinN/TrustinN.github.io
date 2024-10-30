function p_hat = Aitken(x)
    delx = x(2:end) - x(1:end-1);
    del2x = delx(end:end) - delx(1:1);
    p_hat = x(1:1) - ((delx(1:1))^2 ./ del2x);

end

