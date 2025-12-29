import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db'
import ProjectRoutes from './Routes/projectRoutes'  
import cors from 'cors'
import { corsConfig } from './config/cors'
import morgan from 'morgan'

dotenv.config()

// Conection with the DB
connectDB()

const app = express()

//Middlewares

// Read data from requests
app.use(express.json())
// CORS
app.use(cors(corsConfig))
// logging
app.use(morgan('dev'))

// Routes
app.use('/api/projects', ProjectRoutes)

export default app