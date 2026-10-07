import express from 'express';
import { readFile } from 'node:fs/promises';
import pg from 'pg';

const { Client, Pool } = pg;

const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'exobraindb',
  port: 5432,
};

const VALID_PRIORITIES = new Set(['low', 'medium', 'high']);

function normalizeTaskPayload(task) {
  const title = typeof task?.title === 'string' ? task.title.trim() : '';
  const purchased = Boolean(task?.purchased);
  const priority = typeof task?.priority === 'string' ? task.priority.toLowerCase() : 'medium';

  if (!title) {
    throw new Error('Task title is required');
  }

  if (!VALID_PRIORITIES.has(priority)) {
    throw new Error('Priority must be low, medium or high');
  }

  return { title, purchased, priority };
}

async function initializeDatabase() {
  const adminClient = new Client(dbConfig);

  await adminClient.connect();

  try {
    const dbExists = await adminClient.query('SELECT 1 FROM pg_database WHERE datname = $1', ['todo_list']);

    if (dbExists.rowCount === 0) {
      await adminClient.query('CREATE DATABASE "todo_list"');
      console.log('Database created');
    }
  } finally {
    await adminClient.end();
  }

  const db = new Pool({ ...dbConfig, database: 'todo_list' });

  const structureSql = await readFile(new URL('./database/structureDatabase.sql', import.meta.url), 'utf8');
  await db.query(structureSql);
  console.log('Database structure created');

  const seedSql = await readFile(new URL('./database/inserts.sql', import.meta.url), 'utf8');
  const seedResult = await db.query(seedSql);
  console.log(`${seedResult.rowCount} initial tasks inserted`);

  return db;
}

const app = express();
app.use(express.json());

const db = await initializeDatabase();

app.get('/api/tasks', async (_req, res) => {
  try {
    const result = await db.query('SELECT * FROM tasks ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, purchased, priority } = normalizeTaskPayload(req.body);

    const result = await db.query(
      'INSERT INTO tasks (title, purchased, priority) VALUES ($1, $2, $3) RETURNING *',
      [title, purchased, priority]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting task:', error);
    const status = error.message === 'Task title is required' || error.message === 'Priority must be low, medium or high' ? 400 : 500;
    res.status(status).json({ message: error.message || 'Error inserting task' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const taskId = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(taskId)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const { title, purchased, priority } = normalizeTaskPayload(req.body);

    const result = await db.query(
      'UPDATE tasks SET title = $1, purchased = $2, priority = $3 WHERE id = $4 RETURNING *',
      [title, purchased, priority, taskId]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    const status = error.message === 'Task title is required' || error.message === 'Priority must be low, medium or high' ? 400 : 500;
    res.status(status).json({ message: error.message || 'Error updating task' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const taskId = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(taskId)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const result = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [taskId]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});