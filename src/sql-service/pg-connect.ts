
const Pool = require('pg').Pool

// TODO - move pool to app.ts level so one pool is used repeatedly
const db = new Pool({
  user: process.env.POSTGRES_USN || 'postgres',
  host: process.env.POSTGRES_URL || 'localhost',
  database: 'database-1',
  password: process.env.POSTGRES_PASS|| 'password',
  port: 5432,
});

export default db;