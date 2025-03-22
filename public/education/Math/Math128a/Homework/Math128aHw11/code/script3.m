funcs = {@q3f1, @q3f2};
init = [1000, 500];

approx = RKsystem(funcs, init, 0, 4, 99);

t = linspace(0, 4, 100);

plot(t, approx(:, 1), 'b-', t, approx(:, 2), 'r-'); % Optional: Add line styles/colors
legend('Prey', 'Predator');
xlabel('Time');
ylabel('Population');
title('Prey-Predator Dynamics');

