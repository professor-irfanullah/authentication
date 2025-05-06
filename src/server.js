require('dotenv').config
const app = require('./app')


const PORT = process.env.port || 8080
app.listen(PORT, () => console.log(`server is listening at port ${PORT}`))