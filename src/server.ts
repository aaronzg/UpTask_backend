import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db'
import ProjectRoutes from './Routes/projectRoutes'  

dotenv.config()

// Conection with the DB
connectDB()

const app = express()

//Middlewares
app.use(express.json())
// Routes
app.use('/api/projects', ProjectRoutes)

export default app