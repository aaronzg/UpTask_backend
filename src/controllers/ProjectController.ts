import type { Request, Response } from 'express'
import Project from '../Models/Project'

export class ProjectController {
  static getAllProjects = async (req: Request, res: Response) => {
    try {
      // Find the projects of the user
      const projects = await Project.find({ $or: [ {manager: {$in: req.user.id }} ] })
      res.json(projects)
    } catch (error) {
      console.log(error)
    }
  }

  static createProject = async (req: Request, res: Response) => {
    console.log('on createProject')
    // Create an instance of the Project Model with the body of the request
    const project = new Project(req.body)
    project.manager = req.user.id

    try {
      // Save it in the Database
      await project.save()
      return res.send('Proyecto Creado Correctamente')

    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Error al crear el proyecto' })
    }
  }

  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      // Verify if the project exists
      const project = await Project.findById(id).populate('tasks')

      if (!project)
        return res.status(404).json({ error: 'Proyecto no encontrado' })

      // Verify user autorization
      if (project.manager.toString() === req.user.id) return res.json(project)

      return res.status(401).json({ error: 'No autorizado' })
    } catch (error) {
      console.log(error)
    }
  }

  static updateProject = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const project = await Project.findById(id)
      // Verify user autorization
      if (project.manager.toString() !== req.user.id) return res.status(401).json({ error: 'Solo el manager puede actualizar el proyecto' })

      project.clientName = req.body.clientName
      project.projectName = req.body.projectName
      project.description = req.body.description

      // Verify if the project exists
      if (!project)
        return res.status(404).json({ error: 'Proyecto no encontrado' })

      await project.save()
      return res.send('Proyecto Actualizado')
    } catch (error) {
      console.log(error)
    }
  }

  static deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
      // Verify if the project exists
      const project = await Project.findById(id)
      if (!project)
        return res.status(404).json({ error: 'Proyecto no encontrado' })
      
      // Verify user autorization
      if (project.manager.toString() !== req.user.id)
        return res.status(401).json({ error: 'Solo el manager puede eliminar el proyecto' })

      await project.deleteOne()
      res.send('Producto eliminado correctamente')
    } catch (error) {
      console.log(error)
    }
  }
}
