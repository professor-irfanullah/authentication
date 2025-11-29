require("dotenv").config();
const { Pool } = require("pg");
// const db = new Pool({
//     host: process.env.user,
//     user: process.env.pg_user,
//     database: process.env.database,
//     password: process.env.password,
//     port: process.env.db_port || 5432
// })

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});
db.connect()
    .then(() => {
        console.log("Connected to PostgreSQL successfully!");
    })
    .catch((err) => {
        console.error("Connection error:", err.stack);
    });

const query = (query, params) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};
module.exports = { query, db };
