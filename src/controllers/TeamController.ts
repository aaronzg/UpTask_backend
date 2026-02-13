import type { Request, Response } from 'express'
import User from '../Models/User'
import Project from '../Models/Project'

export class TeamController {
  static findMemberByEmail = async (req: Request, res: Response) => {
    try {
      const { email } = req.body
      // Find the user
      const user = await User.findOne({ email }).select('id email name')
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

      return res.json(user)
    } catch (error) {
      return res.status(500).json({ error: 'Hubo un error' })
    }
  }

  static addMemberById = async (req: Request, res: Response) => {
    try {
      const { id } = req.body
      // Verify that the user exists
      const user = await User.findById(id)
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

      // Verify that the user isn't already in the team
      if (req.project.team.includes(user.id))
        return res
          .status(409)
          .json({ error: 'El usuario ya existe en el proyecto' })

      // Add user to the team
      req.project.team.push(user.id)
      await req.project.save()
      return res.send('Usuario agregado correctamente')
    } catch (error) {
      return res.status(500).json({ error: 'Hubo un error' })
    }
  }

  static removeMemberById = async (req: Request, res: Response) => {
    try {
      const { id } = req.body

      // Verify that the user isn't already not on the team
      if (!req.project.team.includes(id))
        return res
          .status(409)
          .json({ error: 'El usuario no existe en el proyecto' })

      // Remove user from the team
      req.project.team = req.project.team.filter(
        (userId) => userId.toString() !== id,
      )
      await req.project.save()
      return res.send('Usuario eliminado correctamente')
    } catch (error) {
      return res.status(500).json({ error: 'Hubo un error' })
    }
  }

  static getAllMembers = async (req: Request, res: Response) => {
    try {
      const project = await Project.findById(req.params.projectId).populate({
        path: 'team',
        select: 'id name email'
      })

     // if(project.team.length < 1) return res.send('No hay miembros en este proyecto')

      return res.json(project.team)

      
    } catch (error) {
      return res.status(500).json({ error: 'Hubo un error' })
    }
  }
}
