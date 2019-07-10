const Pool = require('pg').Pool

// TODO - move pool to app.ts level so one pool is used repeatedly
export async function queryDB(queryString) {
    
    // make new pool
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'p0-ERS',
        password: 'password',
        port: 5432,
      })

    // clients are acquired/relased from pool automatically in the pool.query method
    const result = pool.query(queryString)
    .then(res => {console.log('user:', res.rows)})
    .catch(e => setImmediate(() => { throw e }))
    .then( () => pool.end().then(() => console.log('pool has ended')))
}