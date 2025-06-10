const express = require('express');
const cors = require('cors');
const dbOps = require('./dbOperations');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());



// Add a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the To-Do API');
});

app.get('/todos', async (req, res) => {
  try {
    const todos = await dbOps.getAllTodos();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

app.post('/todos', async (req, res) => {
  try {
    const newTodo = await dbOps.addTodo(req.body.data);
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add todo' });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    console.log('delete params', req.params)
    const result = await dbOps.deleteTodo(req.params.id);
    // const result = await dbOps.deleteTodo(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    console.log('put params', req.params)
    console.log('put body', req.body.data)
    const editTodo = await dbOps.editTodo(req.params.id, req.body.data);
    res.json(editTodo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});