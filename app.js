import express from 'express'
import createError from 'http-errors'
import path from 'path';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import logger from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import config from 'config'

//import for session management

const app = express()
const middleware = require('./middleware')
const port = 3003

// db connection imports
import db from './database/dbConnection'

const loginRoutes = require('./routes/loginRoutes')

// Establish db connection
db.dbConnection()


app.use("/login", loginRoutes )

const server = app.listen(port, () => console.log('Server listerning on port' + port))


