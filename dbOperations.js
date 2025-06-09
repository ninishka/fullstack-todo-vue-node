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
const addTodo = async (name) => {
  try {
    const res = await db.query('INSERT INTO test_table (name) VALUES ($1) RETURNING *', [name]);
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

module.exports = {
  getAllTodos,
  addTodo,
  deleteTodo,
};

//CRUD
// + Create === POST
// +/- Read === GET (u can read all of them, but u cannot read only one for now - so create pls page for todo ID info)
// Update === PUT
// + Delete === DELETE