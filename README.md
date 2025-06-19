# Node.js + Express Backend Learning Guide

## Current Project Status
This is a todo application backend built with Node.js, Express, and PostgreSQL. It includes basic CRUD operations and file upload functionality.

## Technologies Used
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **Nodemon** - Development auto-reload

## Current Features
-  RESTful API endpoints for todos
-  PostgreSQL database integration
-  Image upload with multer
-  File serving for uploaded images
-  Basic error handling
-  CORS configuration

## Node.js/Express Skills Assessment

###  What You Already Know
- Express.js fundamentals
- RESTful API design
- Database operations with PostgreSQL
- File uploads with multer
- Middleware basics
- Environment setup

###  Skills Needed for Junior Developer Role

#### **Essential Backend Technologies**

1. **Authentication & Security**
   - JWT (JSON Web Tokens)
   - Password hashing (bcrypt)
   - Rate limiting
   - Input sanitization

2. **Middleware Patterns**
   - Authentication middleware
   - Error handling middleware
   - Logging middleware
   - Validation middleware

3. **Database Management**
   - Database migrations
   - Connection pooling
   - Query optimization
   - Database relationships

4. **API Best Practices**
   - Input validation (express-validator/Joi)
   - Error response formatting
   - API documentation (Swagger)
   - HTTP status codes

5. **Configuration & Environment**
   - Environment variables (dotenv)
   - Configuration management
   - Logging (Winston)
   - Process management

## Learning Plan for Backend (Node.js/Express)

### **Week 1: Core Backend Skills**

#### **Day 1-2: Authentication**
```bash
npm install jsonwebtoken bcrypt express-validator
```
- Implement user registration/login
- JWT token generation and verification
- Password hashing with bcrypt
- Protected routes middleware

#### **Day 3-4: Advanced Middleware**
```javascript
// Example: Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  
  if (!token) return res.sendStatus(401)
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}
```

#### **Day 5-6: Database & Validation**
- Input validation with express-validator
- Database migrations setup
- Error handling patterns
- Logging implementation

#### **Day 7: API Documentation**
- Swagger/OpenAPI documentation
- Postman collection creation
- Testing strategies

## Essential Node.js Patterns

### **1. Error Handling Middleware**
```javascript
const errorHandler = (err, req, res, next) => {
  console.error(err.stack)
  
  if (err.type === 'validation') {
    return res.status(400).json({ error: err.message })
  }
  
  res.status(500).json({ error: 'Something went wrong!' })
}

app.use(errorHandler)
```

### **2. Validation Middleware**
```javascript
const { body, validationResult } = require('express-validator')

const validateTodo = [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('description').optional().trim(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]
```

### **3. Database Connection Management**
```javascript
// db.js improvement
const { Pool } = require('pg')

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 20, // connection pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

module.exports = pool
```

## Common Backend Interview Topics

1. **RESTful API Design**
   - HTTP methods and status codes
   - Resource naming conventions
   - API versioning

2. **Database Concepts**
   - ACID properties
   - Indexing
   - Query optimization
   - Relationships

3. **Security**
   - Authentication vs Authorization
   - Common vulnerabilities (OWASP Top 10)
   - Data validation

4. **Performance**
   - Caching strategies
   - Database optimization
   - Asynchronous programming

## Next Steps

### **Immediate Actions (This Week)**
1. Add JWT authentication to current project
2. Implement input validation
3. Add error handling middleware
4. Set up environment variables
5. Create API documentation

### **Practice Projects**
1. **User Management System** - Registration, login, profile
2. **Blog API** - Posts, comments, categories
3. **E-commerce API** - Products, orders, inventory

## Study Resources
- [Express.js Official Guide](https://expressjs.com/en/guide/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [JWT.io](https://jwt.io/) - JWT documentation
- [OWASP API Security](https://owasp.org/www-project-api-security/)

## Red Flags to Avoid
- Storing passwords in plain text
- Not validating user input
- Exposing sensitive data in API responses
- Not handling errors properly
- Missing authentication on protected routes

---
*Focus on authentication, validation, and error handling - these are the most critical gaps for a junior backend developer role.* 