import type { Response, Request, NextFunction } from 'express'
import Task, {ITask} from '../Models/Task'

declare global {
  namespace Express {
    interface Request {
      task: ITask
    }
  }
}

export const validateTaskExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId } = req.params
    // Check if the project exists
    const task = await Task.findById(taskId)

    if (!task)
      return res.status(404).json({ error: 'Tarea no encontrada' })

    req.task = task

    next()
  } catch (error) {
    res.status(505).json({ error: 'Hubo un error' })
  }
}

export const taskBelongsToProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if(req.task.project.toString() !== req.project.id.toString()) {
      return res.status(400).json({error: 'Acción no valida'})
    }

    next()
  } catch (error) {
    console.log(error)
  }
}
