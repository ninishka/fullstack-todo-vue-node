// API Routes and Middleware

const express = require('express');//express: Web framework for handling routes, HTTP requests/responses.
const cors = require('cors');//cors: Allows cross-origin requests (my frontend runs on a different port).
const multer = require('multer');//multer: Middleware for handling multipart/form-data (used for file uploads).
const path = require('path');//path: Built-in Node.js module for handling file paths.
const rateLimit = require('express-rate-limit'); // SECURITY: Rate limiting for auth endpoints
const dbOps = require('./dbOperations');//dbOps: A custom module you wrote to interact with your database (CRUD functions).
const authService = require('./authService'); // AUTHENTICATION: auth service
const app = express();
//Initializes app and sets it to run on port 3000.
const port = 3000;

// SECURITY: Rate limiting for auth endpoints to prevent brute force attacks
// Limits each IP to 5 login attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: 'Too many login attempts, please try again later' }
});

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

// FLEXIBLE AUTH MIDDLEWARE: Works with both authenticated and guest users
// This allows the same endpoints to serve both user types
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      // If token exists and is valid, add user ID to request
      const decoded = authService.verifyToken(token);
      req.userId = decoded.userId;
    } catch (error) {
      // Token is invalid, but we continue as guest (don't fail the request)
      req.userId = null;
    }
  } else {
    // No token provided, continue as guest
    req.userId = null;
  }
  next();
};

app.use(cors());//cors(): Allows requests from frontend (like Vue app on a different port).
app.use(express.json());//express.json(): Parses incoming JSON request bodies.
app.use('/uploads', express.static('uploads'));//express.static(): Serves uploaded images from /uploads as static files.

// Add a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the To-Do API with Authentication');//Returns a simple message. Good for checking if the server is running.  
});

// === AUTHENTICATION ROUTES ===
// These are NEW routes for user management

// USER REGISTRATION: Create new account
app.post('/auth/register', authLimiter, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // VALIDATION: Basic input validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // CALL AUTH SERVICE: Let authService handle the business logic
    const result = await authService.register(username, email, password);

    if (result.success) {
      res.status(201).json({
        message: 'User registered successfully',
        user: result.user,
        token: result.token
      });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// USER LOGIN: Authenticate existing user
app.post('/auth/login', authLimiter, async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'Username/email and password are required' });
    }

    // CALL AUTH SERVICE: Let authService handle the business logic
    const result = await authService.login(usernameOrEmail, password);

    if (result.success) {
      res.json({
        message: 'Login successful',
        user: result.user,
        token: result.token
      });
    } else {
      res.status(401).json({ error: result.error });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET CURRENT USER: Protected route to get user details
app.get('/auth/me', authService.authenticateToken, async (req, res) => {
  try {
    // req.userId is set by authenticateToken middleware
    const user = await authService.getUserById(req.userId);
    if (user) {
      res.json({ user });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// === TODO ROUTES (UPDATED with optional authentication) ===

// GET ALL TODOS: Works for both authenticated users and guests
app.get('/todos', optionalAuth, async (req, res) => {
  try {
    // req.userId is null for guests, user ID for authenticated users
    const todos = await dbOps.getAllTodos(req.userId);
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// GET SINGLE TODO: Works for both authenticated users and guests
app.get('/api/todos/:id', optionalAuth, async (req, res) => {
  try {
    const todoId = req.params.id;
    const todo = await dbOps.getTodoById(todoId, req.userId);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (err) {
    console.error('Error fetching todo:', err);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
});

// CREATE TODO: With guest limit enforcement
app.post('/todo', optionalAuth, upload.single('image'), async (req, res) => {
  try {
    // GUEST LIMIT ENFORCEMENT: Check if guest has reached limit
    if (!req.userId) {
      const guestCount = await dbOps.getGuestTodoCount();
      if (guestCount >= 3) {
        return res.status(403).json({ 
          error: 'Guest limit reached. Please sign up or login to create more todos.',
          guestLimitReached: true // Flag for frontend to show signup prompt
        });
      }
    }

    const todoText = req.body.text;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const description = req.body.description;

    // Create todo with user association (null for guests)
    const newTodo = await dbOps.addTodo(todoText, imagePath, description, req.userId);
    res.status(201).json(newTodo);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to add todo' });
  }
});

// DELETE TODO: With user authorization
app.delete('/todo/:id', optionalAuth, async (req, res) => {
  try {
    const result = await dbOps.deleteTodo(req.params.id, req.userId);
    res.json(result);
  } catch (err) {
    if (err.message === 'Todo not found or access denied') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Failed to delete todo' });
    }
  }
});

// UPDATE TODO: With user authorization
app.put('/todo/:id', optionalAuth, async (req, res) => {
  try {
    console.log('put body', req.body.data)

    const id = req.params.id
    const newName = req.body.data.name
    const newDesq = req.body.data.description
    const completed = req.body.data.completed

    const editTodo = await dbOps.editTodo(id, newName, newDesq, completed, req.userId);
    res.json(editTodo);
  } catch (err) {
    if (err.message === 'Todo not found or access denied') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Failed to edit todo' });
    }
  }
});

// GUEST INFO: Get guest todo count and limits (for frontend UI)
app.get('/guest/todo-count', async (req, res) => {
  try {
    const count = await dbOps.getGuestTodoCount();
    res.json({ count, limit: 3, remaining: Math.max(0, 3 - count) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get guest todo count' });
  }
});

app.listen(port, () => {//Starts the Express app and listens for requests on port 3000.
  console.log(`Example app listening at http://localhost:${port}`);
});