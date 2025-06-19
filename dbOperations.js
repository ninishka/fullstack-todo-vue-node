const db = require('./db');

// Function to get all to-do items
const getAllTodos = async () => {
  try {
    const res = await db.query('SELECT * FROM test_table');
    return res.rows;
  } catch (err) {
    console.error('Error fetching todos:', err);
    throw err;
  }
};

// Function to add a new to-do item
const addTodo = async (name, imagePath = null, description) => {
  try {
    const res = await db.query(
      'INSERT INTO test_table (name, image_path, description) VALUES ($1, $2, $3) RETURNING *',
      [name, imagePath, description]
    );
    return res.rows[0];
  } catch (err) {
    console.error('Error adding todo:', err);
    throw err;
  }
};

// Function to delete a to-do item
const deleteTodo = async (id) => {
  try {
    await db.query('DELETE FROM test_table WHERE id = $1', [id]);
    return { message: 'Todo deleted successfully' };
  } catch (err) {
    console.error('Error deleting todo:', err);
    throw err;
  }
};

const editTodo = async (id, newName, newDesq, completed)=> {
  console.log('editTodo id', id)
  console.log('editTodo,newDesq', newDesq)
  console.log('editTodo newName', newName)
  try {
    const res = await db.query(
      'UPDATE test_table SET name = $1, description = $3, completed = $4 WHERE id = $2 RETURNING *',
      [newName, id, newDesq, completed]
    );
    return res.rows[0];
  } catch (err) {
    console.error('Error updating todo:', err);
    throw err;
  }
};

// Function to get a single to-do item by ID
const getTodoById = async (id) => {
  try {
    const res = await db.query('SELECT * FROM test_table WHERE id = $1', [id]);
    return res.rows[0]; // Return the first (and only) row, or undefined if not found
  } catch (err) {
    console.error('Error fetching todo by ID:', err);
    throw err;
  }
};

module.exports = {
  getAllTodos,
  addTodo,
  deleteTodo,
  editTodo,
  getTodoById
};
