const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const dbOps = require('./dbOperations');
const app = express();
const port = 3000;

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

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

app.post('/todo', upload.single('image'), async (req, res) => {
  try {
    const todoText = req.body.text;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    
    const newTodo = await dbOps.addTodo(todoText, imagePath);
    res.status(201).json(newTodo);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to add todo' });
  }
});

app.delete('/todo/:id', async (req, res) => {
  try {
    console.log('delete params', req.params)
    const result = await dbOps.deleteTodo(req.params.id);
    // const result = await dbOps.deleteTodo(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

app.put('/todo/:id', async (req, res) => {
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