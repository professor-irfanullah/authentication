const express = require('express')
const cookies = require('cookie-parser')
const { notFound } = require('./middlewares/routeNotFound')
const { customErrorHandler } = require('./middlewares/customErrorHandler')
const cors = require('cors')
const authRouter = require('./routes/auth')
const seekerRoutes = require('./routes/seekers_route')
const employeeRoutes = require('../src/routes/employe_route')
const app = express()
const allowedOrigins = [
    'https://job-board-front-end-psi.vercel.app',
    'https://job-board-frontend-production.up.railway.app',
    'http://localhost:5173'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(cookies())
app.use('/api/auth', authRouter)
app.use('/api/seeker', seekerRoutes)
app.use('/api/employee', employeeRoutes)

// middlewares
app.use(notFound)
app.use(customErrorHandler)

module.exports = app