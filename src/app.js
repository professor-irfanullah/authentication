const express = require('express')
const authRouter = require('./routes/auth')
const cookies = require('cookie-parser')
const { notFound } = require('./middlewares/routeNotFound')
const { customErrorHandler } = require('./middlewares/customErrorHandler')
const cors = require('cors')
const seekerRoutes = require('./routes/seekers_route')
const app = express()
// origin: 'http://localhost:5173',
app.use(cors({
    origin: 'https://job-board-frontend-production.up.railway.app',
    credentials: true
}))
app.use(cookies())
app.use('/api/auth', authRouter)
app.use('/api/seeker', seekerRoutes)


// middlewares
app.use(notFound)
app.use(customErrorHandler)

module.exports = app