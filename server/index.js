import express from 'express';
import {Client, Pool} from 'pg';

const dbConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'todolist',
    password: '1234',
    port: 5432,
};

async function initializeDatabase() {
    const userDB = new Client(dbConfig);

    await userDB.connect();

    try {
        await userDB.query('SELECT 1 FROM pg_database WHERE datname = $1', ['todolist']);
        console.log('Connected to the database');
    } finally {
        await userDB.end();
    }



    const db = new Pool(dbConfig);

    const structureDB = await readFile('./server/database/createDatabase.sql', 'utf8');
    await db.query(structureDB);

    const insertDataSQL = await readFile('./server/database/insertData.sql', 'utf8');
    await db.query(insertDataSQL);

    return db;

}

const app = express();
app.use(express.json());

const db = await initializeDatabase();

app.get('/api/tasks', (req, res) => {
    res.json(db.query('SELECT * FROM tasks'));
});

app.post('/api/tasks', (req, res) => {

    const newTask = req.body;
    db.query('INSERT INTO tasks (title, priority) VALUES ($1, $2) RETURNING *', [newTask.title, newTask.priority])
        .then(result => {
            res.status(201).json(result.rows[0]);
        })
        .catch(err => {
            console.error('Error inserting task:', err);
            res.status(500).json({ message: 'Error inserting task' });
        });
});

app.put('/api/tasks/:id', (req, res) => {  
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    db.query('UPDATE tasks SET title = $1, priority = $2 WHERE id = $3 RETURNING *', [req.body.title, req.body.priority, taskId])
        .then(result => {
            if (result.rows.length > 0) {
                res.json(result.rows[0]);
            } else {
                res.status(404).json({ message: 'Task not found' });
            }
        })
        .catch(err => {
            console.error('Error updating task:', err);
            res.status(500).json({ message: 'Error updating task' });
        });
});

app.delete('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    db.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [taskId])
        .then(result => {
            if (result.rows.length > 0) {
                res.json(result.rows[0]);
            } else {
                res.status(404).json({ message: 'Task not found' });
            }
        })
        .catch(err => {
            console.error('Error deleting task:', err);
            res.status(500).json({ message: 'Error deleting task' });
        });
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});