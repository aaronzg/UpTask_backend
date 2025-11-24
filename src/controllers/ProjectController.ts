import type { Request, Response } from "express"
import Project from "../Models/Project"

export class ProjectController {
  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({})
      res.json(projects)
    } catch (error) {
      console.log(error)
    }
  }

  static createProject = async (req: Request, res: Response) => {
    // Create an instance of the Project Model with the body of the request
    const project = new Project(req.body)

    try {
      // Save it in the Database
      await project.save()
      res.send('Proyecto Creado Correctamente')
    } catch (error) {
      console.log(error)
    }
  }

  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const project = await Project.findById( id ).populate('tasks')

      if(!project) return res.status(404).json({ error: 'Proyecto no encontrado' })

      res.json(project)
    } catch (error) {
      console.log(error)
    }
  }

  static updateProject = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const project = await Project.findById(id)
      project.clientName = req.body.clientName
      project.projectName = req.body.projectName
      project.description = req.body.description

      if (!project) return res.status(404).json({ error: 'Proyecto no encontrado'})

      await project.save()
      res.send('Proyecto Actualizado')
    } catch (error) {
      console.log(error)
    }
  }

  static deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
      const project = await Project.findById(id)
      if (!project) return res.status(404).json({ error: 'Proyecto no encontrado'})

      await project.deleteOne()
      res.send('Producto eliminado correctamente')
    } catch (error) {
      console.log(error)
    }
  }
} 