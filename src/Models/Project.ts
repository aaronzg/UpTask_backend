import mongoose, { Schema, Document } from 'mongoose'

// Creamos el type para nuestro modelo
export type ProjectType = Document & {
  projectName: string
  clientName: string
  description: string
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
})

// Register the Project Model in mongoose
const Project = mongoose.model<ProjectType>('Project', ProjectSchema)
export default Project
 