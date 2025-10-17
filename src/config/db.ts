import mongoose from 'mongoose'
import { green, red } from 'colors'
import { exit } from 'node:process'

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL)
    // console.log(connection) <== this displays a lot of information

    // Displays only the URL instead
    const url = `${connection.connection.host}:${connection.connection.port}`
    console.log(green.bold(`MongoDB connected in ${url}`))
  } catch (error) {
    console.log(red.bold('Error while connecting with MongoDB'))
    exit(1) 
  }
}