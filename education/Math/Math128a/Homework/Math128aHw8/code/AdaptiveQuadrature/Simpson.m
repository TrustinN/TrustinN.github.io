function APP = Simpson(f, a, b, tol, n)
APP = 0;
i = 1;
TOL = zeros(1, n); A = zeros(1, n); h = zeros(1, n); S = zeros(1, n);
TOL(i) = 10 * tol;
A(i) = a;
h(i) = (b - a) / 2;

FA = zeros(1, n); FC = zeros(1, n); FB = zeros(1, n);
FA(i) = f(a); FC(i) = f(a + h(i)); FB(i) = f(b);

% initial compute of Simpson
S(i) = h(i) * (FA(i) + 4 * FC(i) + FB(i)) / 3;

L = zeros(1, n);
L(i) = 1;

while i > 0
    % Simpson for l, r subinterval
    FD = f(A(i) + h(i) / 2);
    FE = f(A(i) + 3 * h(i) / 2);
    S1 = h(i) * (FA(i) + 4 * FD + FC(i)) / 6;
    S2 = h(i) * (FC(i) + 4 * FE + FB(i)) / 6;
    v1 = A(i); v2 = FA(i); v3 = FC(i); v4 = FB(i); v5 = h(i); v6 = TOL(i); v7 = S(i); v8 = L(i);
    
    i = i - 1; % pop the node
    if abs(S1 + S2 - v7) < v6
        APP = APP + (S1 + S2);
    else
        if v8 >= n
            break
        end
        % Set left subinterval
        i = i + 1;
        A(i) = v1 + v5;
        FA(i) = v3; FC(i) = FE; FB(i) = v4;
        h(i) = v5 / 2;
        TOL(i) = v6 / 2;
        S(i) = S2;
        L(i) = v8 + 1;
        
        % Set right subinterval
        i = i + 1;
        A(i) = v1;
        FA(i) = v2; FC(i) = FD; FB(i) = v3;
        h(i) = h(i - 1);
        TOL(i) = TOL(i - 1);
        S(i) = S1;
        L(i) = L(i - 1);
    end
end
