import express from 'express'
import createError from 'http-errors'
import path from 'path'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import logger from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import config from 'config'

//import for session management
// Imports for authentication
import passport from 'passport'
import passportAuth from './authentication/passportAuth.js'

// db connection imports
// import db from './database/dbConnection'

// Router imports
import securityRouter from './routes/security.js'

// Establish db connection
db.dbConnection()

const app = express()

app.use(cookieParser())
app.use(helmet())
app.use(compression())
app.use(express.json())

// Configure authentication
passportAuth.initializePassport(passport)
app.use(passport.initialize())
app.use(passport.session())

// To Allow cross origin requests originating from selected origins
var corsOptions = {
  origin: config.get('allowed_origins'),
  methods: ['GET, POST, OPTIONS, PUT, DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}

app.use(cors(corsOptions))

app.use('/security', securityRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

export default app
