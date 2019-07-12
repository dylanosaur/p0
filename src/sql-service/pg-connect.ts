const Pool = require('pg').Pool

// TODO - move pool to app.ts level so one pool is used repeatedly
const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'p0-ERS',
  password: 'password',
  port: 5432,
});

export default db;