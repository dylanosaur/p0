const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'PubHub',
  password: 'password',
  port: 5432,
})

// clients are acquired/relased from pool automatically in the pool.query method
pool.query('SELECT * FROM books', (error, results) => {
    if (error) {
      throw error
    }
    console.log(results.rows)
})

// or this:
pool.end().then(() => console.log('pool has ended'))