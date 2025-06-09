const db = require('./db');

const createTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS test_table (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL
    );
  `;

  try {
    await db.query(queryText);
    console.log('Table created successfully');
  } catch (err) {
    console.error('Error creating table:', err);
  }
};

const insertData = async () => {
  const queryText = 'INSERT INTO test_table (name) VALUES ($1) RETURNING *';
  const values = ['Sample Name'];

  try {
    const res = await db.query(queryText, values);
    console.log('Data inserted:', res.rows[0]);
  } catch (err) {
    console.error('Error inserting data:', err);
  }
};

const setupDatabase = async () => {
  await createTable();
  await insertData();
};

setupDatabase(); 