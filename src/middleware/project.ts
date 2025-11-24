import type { Response, Request, NextFunction} from 'express'
import Project, { IProject } from '../Models/Project'

declare global {
  namespace Express {
    interface Request {
      project: IProject
    }
  }
}

export const validateProjectExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params
    // Check if the project exists
    const project = await Project.findById(projectId)

    if (!project)
      return res.status(404).json({ error: 'Proyecto no encontrado' })

    req.project = project

    next()
  } catch (error) {
    res.status(505).json({ error: 'Hubo un error'})
  }
}

