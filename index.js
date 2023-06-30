import express from 'express' // ES modules
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/user.routes.js'
import db from './config/db.js'

// Create app
const app = express()

// Enable form reading
app.use(express.urlencoded({ extended: true }))

// Public folder
app.use(express.static('public'))

// Enable cookie parsing
app.use(cookieParser())

// Enable CSRF
app.use(csrf({ cookie: true }))

// Enable Pug
app.set('view engine', 'pug')
app.set('views', './views')

app.use('/auth', userRoutes)

// DB connection
try {
  await db.authenticate()
  db.sync()
    .then(() => {
      // Run project
      app.listen(process.env.PORT || 3000)
    })
    .catch((error) => {
      console.error('Sincronize DB error:', error)
    })

  console.log('Connecting to database complete')
} catch (error) {
  console.log(error)
  throw new Error('Db connection error: ' + error)
}
