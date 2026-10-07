import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/tasks', (req, res) => {
    const tasks = [
        { id: 1, title: 'Task 1', purchased: true, priority: 'high' },
        { id: 2, title: 'Task 2', purchased: false, priority: 'medium' },
        { id: 3, title: 'Task 3', purchased: false, priority: 'low' },
    ];
    res.json(tasks);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});