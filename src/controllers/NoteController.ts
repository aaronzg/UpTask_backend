import type { Request, Response } from 'express'
import Note, { INote } from '../Models/Node'
import { Types } from 'mongoose'

type  NoteParams = {
  noteId: Types.ObjectId
}

export class NoteController {
  static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
    const { content } = req.body

    try {
      const note = new Note({
        content,
        createdBy: req.user.id,
        task: req.task.id,
      })

      // Save the note in the task
      req.task.notes.push(note.id)
      // Save the note and the task
      await Promise.allSettled([req.task.save(), note.save()])

      return res.send('Nota creada correctamente')
    } catch (error) {
      return res.status(500).json({ error: 'Hubo un error' })
    }
  }

  static getTaskNotes = async (req: Request, res: Response) => {
    try {
      const notes = await Note.find({ task: req.task.id })
      return res.json(notes)
    } catch (error) {
      return res.status(500).json({ error: 'Hubo un error' })
    }
  }

  static deleteNote = async (req: Request<NoteParams>, res: Response) => {
    try {
      const { noteId } = req.params
      const note = await Note.findById(noteId)

      // Check that the note exists
      if(!note) return res.status(404).json({ error: 'Nota no encontrada' })
      // Check that the user is the one who created the note
      if(note.createdBy.toString() !== req.user.id.toString()) return res.status(401).json({ error: 'Accion no valida' })
      // Delete the note
      req.task.notes = req.task.notes.filter(tnote => tnote.id.toString() !== noteId.toString())
      await Promise.allSettled([req.task.save(), note.deleteOne()])

      return res.send('Nota eliminada correctamente')

    } catch (error) {
      return res.status(500).json({ error: 'Hubo un error' })
    }
  }
}
