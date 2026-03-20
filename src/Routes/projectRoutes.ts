import { Router } from 'express'
import { ProjectController } from '../controllers/ProjectController'
import { body, param } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'
import { TaskController } from '../controllers/taskController'
import { validateProjectExists } from '../middleware/project'
import {
  hasAuthorization,
  taskBelongsToProject,
  validateTaskExists,
} from '../middleware/task'
import { authenticate } from '../middleware/auth'
import { TeamController } from '../controllers/TeamController'
import { NoteController } from '../controllers/NoteController'

const router = Router()

router.use(authenticate)

// Create new Project
router.post(
  '/',
  body('projectName')
    .notEmpty()
    .withMessage('El nombre del proyecto es Obligatorio'),
  body('clientName')
    .notEmpty()
    .withMessage('El nombre del cliente es Obligatorio'),
  body('description')
    .notEmpty()
    .withMessage('La descripción del proyecto es Obligatoria'),
  handleInputErrors,
  ProjectController.createProject,
)

// Get all Projects
router.get('/', ProjectController.getAllProjects)
// Verify id middleware
router.use(
  '/:id',
  param('id').isMongoId().withMessage('ID no valido'),
  handleInputErrors,
)

// Get Project by id
router.get('/:id', ProjectController.getProjectById)
// Update Project
router.put(
  '/:id',
  body('projectName')
    .notEmpty()
    .withMessage('El nombre del proyecto es Obligatorio'),
  body('clientName')
    .notEmpty()
    .withMessage('El nombre del cliente es Obligatorio'),
  body('description')
    .notEmpty()
    .withMessage('La descripción del proyecto es Obligatoria'),
  handleInputErrors,
  ProjectController.updateProject,
)
// Delete Project by ID
router.delete('/:id', ProjectController.deleteProject)

/* **** TASK ROUTES **** */

// Validate that the project exists
router.param('projectId', validateProjectExists)
// Validate that the task exists
router.param('taskId', validateTaskExists)
// Validate that the task belongs the the project
router.param('taskId', taskBelongsToProject)

// Create task
router.post(
  '/:projectId/tasks',
  hasAuthorization,
  body('name').notEmpty().withMessage('El Nombre de la tarea es Obligatorio'),
  body('description')
    .notEmpty()
    .withMessage('La descripción de la tarea es obigatoria'),
  handleInputErrors,
  TaskController.createTask,
)

// Get the tasks from a Project
router.get('/:projectId/tasks', TaskController.getProjectTasks)

// Get task by ID
router.get('/:projectId/tasks/:taskId', TaskController.getTaskById)

// Edit Task
router.put(
  '/:projectId/tasks/:taskId',
  hasAuthorization,
  body('name').notEmpty().withMessage('El Nombre de la tarea es Obligatorio'),
  body('description')
    .notEmpty()
    .withMessage('La descripción de la tarea es obigatoria'),
  handleInputErrors,
  TaskController.updateTask,
)

// Delete task
router.delete(
  '/:projectId/tasks/:taskId',
  hasAuthorization,
  TaskController.deleteTask,
)

// Update task state
router.post(
  '/:projectId/tasks/:taskId/status',
  body('status').notEmpty().withMessage('El estado es obligatorio'),
  handleInputErrors,
  TaskController.updateStatus,
)

/** ROUTES FOR TEAMS **/
router.post(
  '/:projectId/team/find',
  body('email').isEmail().toLowerCase().withMessage('Email no valido'),
  handleInputErrors,
  TeamController.findMemberByEmail,
)

router.post(
  '/:projectId/team',
  body('id').isMongoId().withMessage('ID no valido'),
  handleInputErrors,
  TeamController.addMemberById,
)

router.delete(
  '/:projectId/team/:userId',
  param('userId').isMongoId().withMessage('ID no valido'),
  handleInputErrors,
  TeamController.removeMemberById,
)

router.get('/:projectId/team', TeamController.getAllMembers)

/**  ROUTES FOR NOTES  **/
router.post(
  '/:projectId/tasks/:taskId/notes',
  body('content')
    .notEmpty()
    .withMessage('El contenido de la nota es obligatorio'),
  handleInputErrors,
  NoteController.createNote,
)

router.get('/:projectId/tasks/:taskId/notes', NoteController.getTaskNotes)

router.delete('/:projectId/tasks/:taskId/notes/:noteId', 
  param('noteId')
  .isMongoId().withMessage('ID no valido'),
  handleInputErrors,
  NoteController.deleteNote
)

export default router
