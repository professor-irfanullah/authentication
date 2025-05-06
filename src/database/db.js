require('dotenv').config()
const mysql = require('mysql2')
const db = mysql.createPool({
    user: process.env.user,
    database: process.env.database,
    password: process.env.password,
    waitForConnections: true,
    connectionLimit: 10
})
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