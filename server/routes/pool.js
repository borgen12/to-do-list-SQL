const pg = require('pg');

// Setup pg to talk to our songs database
const Pool = pg.Pool;
const pool = new Pool({
    database: 'weekend-to-do-app', 
    host: 'localhost',
    port: 5432,
    max: 10, 
    idleTimeoutMillis: 30000 
});


pool.on('connect', () => {
    console.log('Postgres connected');
})

pool.on('error', (error) => {
    console.log('Database error ', error);
})

module.exports = pool;