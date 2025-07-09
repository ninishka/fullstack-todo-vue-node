//database operation with user separation

const db = require('./db');

// AUTHENTICATION-AWARE: Get todos based on user status
// - If userId provided: get that user's todos only
// - If no userId (guest): get only guest todos (user_id = NULL)
const getAllTodos = async (userId = null) => {
  try {
    let query, params;
    
    if (userId) {
      // AUTHENTICATED USER: Get their personal todos only
      query = 'SELECT * FROM test_table WHERE user_id = $1 ORDER BY created_at DESC';
      params = [userId];
    } else {
      // GUEST USER: Get only guest todos (no user ownership)
      query = 'SELECT * FROM test_table WHERE user_id IS NULL ORDER BY created_at DESC';
      params = [];
    }
    
    const res = await db.query(query, params);
    return res.rows;
  } catch (err) {
    console.error('Error fetching todos:', err);
    throw err;
  }
};

// GUEST LIMIT: Count how many todos guests have created
// This is used to enforce the 3-todo limit for non-authenticated users
const getGuestTodoCount = async () => {
  try {
    const res = await db.query('SELECT COUNT(*) FROM test_table WHERE user_id IS NULL');
    return parseInt(res.rows[0].count);
  } catch (err) {
    console.error('Error counting guest todos:', err);
    throw err;
  }
};

// USER-AWARE TODO CREATION: Associates todos with users or marks as guest
const addTodo = async (name, imagePath = null, description, userId = null) => {
  try {
    // Insert todo with user_id (null for guests, user ID for authenticated users)
    const res = await db.query(
      'INSERT INTO test_table (name, image_path, description, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, imagePath, description, userId]
    );
    return res.rows[0];
  } catch (err) {
    console.error('Error adding todo:', err);
    throw err;
  }
};

// SECURITY: Users can only delete their own todos, guests only guest todos
const deleteTodo = async (id, userId = null) => {
  try {
    let query, params;
    
    if (userId) {
      // AUTHENTICATED USER: Only delete their own todos
      query = 'DELETE FROM test_table WHERE id = $1 AND user_id = $2';
      params = [id, userId];
    } else {
      // GUEST USER: Only delete guest todos (user_id IS NULL)
      query = 'DELETE FROM test_table WHERE id = $1 AND user_id IS NULL';
      params = [id];
    }
    
    const result = await db.query(query, params);
    
    // SECURITY CHECK: If no rows affected, either todo doesn't exist or access denied
    if (result.rowCount === 0) {
      throw new Error('Todo not found or access denied');
    }
    
    return { message: 'Todo deleted successfully' };
  } catch (err) {
    console.error('Error deleting todo:', err);
    throw err;
  }
};

// SECURITY: Users can only edit their own todos, guests only guest todos
const editTodo = async (id, newName, newDesq, completed, userId = null) => {
  console.log('editTodo id', id)
  console.log('editTodo,newDesq', newDesq)
  console.log('editTodo newName', newName)
  try {
    let query, params;
    
    if (userId) {
      // AUTHENTICATED USER: Only edit their own todos
      query = 'UPDATE test_table SET name = $1, description = $3, completed = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $5 RETURNING *';
      params = [newName, id, newDesq, completed, userId];
    } else {
      // GUEST USER: Only edit guest todos (user_id IS NULL)
      query = 'UPDATE test_table SET name = $1, description = $3, completed = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id IS NULL RETURNING *';
      params = [newName, id, newDesq, completed];
    }
    
    const res = await db.query(query, params);
    
    // SECURITY CHECK: If no rows affected, either todo doesn't exist or access denied
    if (res.rows.length === 0) {
      throw new Error('Todo not found or access denied');
    }
    
    return res.rows[0];
  } catch (err) {
    console.error('Error updating todo:', err);
    throw err;
  }
};

// SECURITY: Users can only view their own todos, guests only guest todos
const getTodoById = async (id, userId = null) => {
  try {
    let query, params;
    
    if (userId) {
      // AUTHENTICATED USER: Only get their own todos
      query = 'SELECT * FROM test_table WHERE id = $1 AND user_id = $2';
      params = [id, userId];
    } else {
      // GUEST USER: Only get guest todos (user_id IS NULL)
      query = 'SELECT * FROM test_table WHERE id = $1 AND user_id IS NULL';
      params = [id];
    }
    
    const res = await db.query(query, params);
    return res.rows[0]; // Return the first (and only) row, or undefined if not found
  } catch (err) {
    console.error('Error fetching todo by ID:', err);
    throw err;
  }
};

// EXPORT: Make these functions available to the main server
module.exports = {
  getAllTodos,
  addTodo,
  deleteTodo,
  editTodo,
  getTodoById,
  getGuestTodoCount  // New function for guest limit enforcement
};
