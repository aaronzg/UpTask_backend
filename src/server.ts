import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db'

dotenv.config()

// Conection with the DB
connectDB()

const app = express()

export default app