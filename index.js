const express = require('express');//express: Web framework for handling routes, HTTP requests/responses.
const cors = require('cors');//cors: Allows cross-origin requests (my frontend runs on a different port).
const multer = require('multer');//multer: Middleware for handling multipart/form-data (used for file uploads).
const path = require('path');//path: Built-in Node.js module for handling file paths.
const dbOps = require('./dbOperations');//dbOps: A custom module you wrote to interact with your database (CRUD functions).
const app = express();
//Initializes app and sets it to run on port 3000.
const port = 3000;

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {//destination: Where uploaded images are saved (uploads/ folder).
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))//filename: Renames the file to avoid name conflicts using the current timestamp.
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Sets a file size limit (5MB).
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    //Validates that the uploaded file is an image (jpeg, jpg, png, gif).

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

app.use(cors());//cors(): Allows requests from frontend (like Vue app on a different port).
app.use(express.json());//express.json(): Parses incoming JSON request bodies.
app.use('/uploads', express.static('uploads'));//express.static(): Serves uploaded images from /uploads as static files.

// Add a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the To-Do API');//Returns a simple message. Good for checking if the server is running.
});

app.get('/todos', async (req, res) => {
  try {
    const todos = await dbOps.getAllTodos();//Calls getAllTodos() from dbOperations.js.
    res.json(todos);//returns all todos as json
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

app.post('/todo', upload.single('image'), async (req, res) => {
  try {
    const todoText = req.body.text;//Retrieves the text input from the form.is where the user-typed task name is captured.
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    
    const newTodo = await dbOps.addTodo(todoText, imagePath);
    res.status(201).json(newTodo);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to add todo' });
  }
});

app.delete('/todo/:id', async (req, res) => {//Deletes a todo based on id from the URL.
  try {
    console.log('delete params', req.params)
    const result = await dbOps.deleteTodo(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

app.put('/todo/:id', async (req, res) => {//updates doto based on its id.
  try {
    console.log('put params', req.params)
    console.log('put body', req.body.data)
    const editTodo = await dbOps.editTodo(req.params.id, req.body.data);
    res.json(editTodo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

app.listen(port, () => {//Starts the Express app and listens for requests on port 3000.
  console.log(`Example app listening at http://localhost:${port}`);
});