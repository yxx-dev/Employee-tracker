INSERT INTO department (id, name)
VALUES  (1, 'IT'),
        (2, 'Marketing'),
        (3, 'Sales');

INSERT INTO role (id, title, salary, department_id)
VALUES  (1, 'CTO', 1000000, 1),
        (2, 'CMO', 200000, 2),
        (3, 'Sales Manager', 250000, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES  (1, 'Yilun', 'Xu', 1, null),
        (2, 'Tim', 'Cook', 2, 1),
        (3, 'Jeff', 'Bezos', 3, 1);