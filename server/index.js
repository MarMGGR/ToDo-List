import express from 'express';

const app = express();
app.use(express.json());

const tasks = [
    { id: 1, title: 'Task 1', purchased: true, priority: 'high' },
    { id: 2, title: 'Task 2', purchased: false, priority: 'medium' },
    { id: 3, title: 'Task 3', purchased: false, priority: 'low' },
];

app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
    const newTask = req.body;
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {  
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex] = req.body;
        res.json(tasks[taskIndex]);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

app.delete('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});