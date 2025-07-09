// Heart  of  authentication logic 

const bcrypt = require('bcryptjs');  // For password hashing
const jwt = require('jsonwebtoken');   // For creating/verifying JWT tokens
const db = require('./db');            // Database connection

// JWT Secret (in production, use environment variable)
// This secret is used to sign and verify JWT tokens
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

// SECURITY: Hash password before storing in database
// bcrypt adds "salt" to prevent rainbow table attacks
const hashPassword = async (password) => {
  const saltRounds = 12; // Higher = more secure but slower
  return await bcrypt.hash(password, saltRounds);
};

// SECURITY: Compare login password with stored hash
// Never store or compare plain text passwords!
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};


// A token is a small, secure piece of data used to 
// represent identity or permission. It's often used in authentication and authorization.
// JWT TOKEN: Create a signed token containing user ID
// This token proves the user is authenticated
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// JWT TOKEN: Verify that a token is valid and not expired
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

// USER REGISTRATION: Create new user account
const register = async (username, email, password) => {
  try {
    // STEP 1: Check if user already exists (prevent duplicates)
    const existingUser = await db.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('Username or email already exists');
    }

    // STEP 2: Hash the password (NEVER store plain text!)
    const hashedPassword = await hashPassword(password);

    // STEP 3: Insert new user into database
    const result = await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, hashedPassword]
    );

    const user = result.rows[0];
    
    // STEP 4: Generate JWT token for immediate login
    const token = generateToken(user.id);

    // STEP 5: Return success with user data (no password!)
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at
      },
      token
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// USER LOGIN: Authenticate existing user
const login = async (usernameOrEmail, password) => {
  try {
    // STEP 1: Find user by username OR email (flexible login)
    const result = await db.query(
      'SELECT id, username, email, password_hash, created_at FROM users WHERE username = $1 OR email = $1',
      [usernameOrEmail]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid credentials'); // Don't reveal if user exists
    }

    const user = result.rows[0];

    // STEP 2: Compare provided password with stored hash
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials'); // Same error message for security
    }

    // STEP 3: Generate new JWT token
    const token = generateToken(user.id);

    // STEP 4: Return success with user data (no password!)
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at
      },
      token
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// MIDDLEWARE: Verify JWT token on protected routes
// This runs before protected API endpoints
const authenticateToken = (req, res, next) => {
  // STEP 1: Extract token from Authorization header
  // Expected format: "Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    // STEP 2: Verify token is valid and not expired
    const decoded = verifyToken(token);
    
    // STEP 3: Add user ID to request object for use in route handlers
    req.userId = decoded.userId;
    next(); // Continue to the actual route handler
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// UTILITY: Get user details by ID (used by /auth/me endpoint)
const getUserById = async (userId) => {
  try {
    const result = await db.query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    throw new Error('Failed to fetch user');
  }
};

// EXPORT: Make these functions available to other files
module.exports = {
  register,
  login,
  authenticateToken,
  getUserById,
  generateToken,
  verifyToken
}; 