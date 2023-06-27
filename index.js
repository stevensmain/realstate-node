import express from 'express' // ES modules
import userRoutes from './routes/user.routes.js'
import db from './config/db.js'

// Create app
const app = express()

// Enable form reading
app.use(express.urlencoded({ extended: true }))

// DB connection
try {
  await db.authenticate()
  db.sync()
  console.log('Connecting to database complete')
} catch (error) {
  console.log(error)
  throw new Error('Db connection error: ' + error)
}

// Public folder
app.use(express.static('public'))

// Enable Pug
app.set('view engine', 'pug')
app.set('views', './views')

app.use('/auth', userRoutes)

// Port definition
const port = 3000

// Run project
app.listen(port)
