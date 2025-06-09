const { Pool } = require('pg');

const pool = new Pool({
  user: 'nini',               // your DB user
  host: 'localhost',          // DB server address
  database: 'testdb',         // your DB name
  password: 'mySecurePassword22002255',  // your DB password
  port: 5432,                 // default PostgreSQL port
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};