import mongoose, { Schema, Document, PopulatedDoc, Types } from 'mongoose'
import { ITask } from './Task'

// Creamos el type para nuestro modelo
export interface IProject extends Document  {
  projectName: string
  clientName: string
  description: string
  tasks: PopulatedDoc<ITask & Document>[]
}

// Creamos el schema para nuestro modelo
const ProjectSchema: Schema = new Schema({
  projectName: {
    type: String, // Indica que tipo va a tener esta propiedad
    require: true, // hace que la propiedad se obligatoria
    trim: true, // elimina los espacios en blanco
  },
  clientName: {
    type: String,
    require: true,
    trim: true,
  },
  description: {
    type: String,
    require: true,
    trim: true,
  },
  tasks: [
    {
      type: Types.ObjectId,
      ref: 'Task'
    },
    {timestamps: true} // Almacenar cuando se creo o modifico
  ]
})

// Register the Project Model in mongoose
const Project = mongoose.model<IProject>('Project', ProjectSchema)
export default Project
 