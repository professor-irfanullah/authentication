require('dotenv').config()
const { Pool } = require('pg')
// const db = new Pool({
//     user: process.env.user,
//     database: process.env.database,
//     password: process.env.password,
//     port: process.env.db_port || 5432
// })

// const db = new Pool({
//     // connectionString: process.env.DATABASE_URL,
//     connectionString: process.env.db_connection_url,

// });

const db = new Pool({
    user: process.env.user,
    host: process.env.db_connection_url,  // Replace with your private domain
    database: process.env.database,
    password: process.env.password,
    port: 5432,
    max: 10, // Max number of connections
    idleTimeoutMillis: 30000, // Idle timeout in milliseconds
    connectionTimeoutMillis: 2000, // Time to wait for a connection to be established
    ssl: {
        rejectUnauthorized: false // Needed for some cloud providers like Railway
    }
});


// Test the connection
db.connect()
    .then(() => {
        console.log('Connected to PostgreSQL successfully!');
    })
    .catch(err => {
        console.error('Connection error:', err.stack);
    });

const query = (query, params) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, result) => {
            if (err) {
                return reject(err)
            }
            resolve(result)
        })
    })
}
module.exports = { query }