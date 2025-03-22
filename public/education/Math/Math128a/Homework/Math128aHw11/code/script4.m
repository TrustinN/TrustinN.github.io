funcs = {@q4f1, @q4f2};
init = [10000, 10000];

approx = RKsystem(funcs, init, 0, 4, 99);
t = linspace(0, 4, 100);

plot(t, approx(:, 1), 'b-', t, approx(:, 2), 'r-'); % Optional: Add line styles/colors
legend('Prey', 'Predator');
xlabel('Time');
ylabel('Population');
title('Prey-Predator Dynamics');
