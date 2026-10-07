INSERT INTO tasks (title, priority, purchased)
SELECT seed.title, seed.priority, FALSE
FROM (VALUES
    ('Prepare for the presentation', 'high'),
    ('Plan a weekend trip', 'low'),
    ('Read a book', 'low')
) AS seed(title, priority)
WHERE NOT EXISTS (
    SELECT 1
    FROM tasks
    WHERE tasks.title = seed.title
      AND tasks.priority = seed.priority
);