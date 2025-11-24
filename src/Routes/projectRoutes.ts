import { Router } from 'express'
import { ProjectController } from '../controllers/ProjectController'
import { body, param } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'
import { TaskController } from '../controllers/taskController'
import { validateProjectExists } from '../middleware/project'
import { taskBelongsToProject, validateTaskExists } from '../middleware/task'

const router = Router()

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
  ProjectController.createProject
)

// Get all Projects
router.get('/', ProjectController.getAllProjects)
// Verify id middleware
router.use(
  '/:id',
  param('id').isMongoId().withMessage('ID no valido'),
  handleInputErrors
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
  ProjectController.updateProject
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
  body('name').notEmpty().withMessage('El Nombre de la tarea es Obligatorio'),
  body('description')
    .notEmpty()
    .withMessage('La descripción de la tarea es obigatoria'),
  handleInputErrors,
  TaskController.createTask
)

// Get the tasks from a Project
router.get('/:projectId/tasks', TaskController.getProjectTasks)

// Get task by ID
router.get('/:projectId/tasks/:taskId', TaskController.getTaskById)

// Edit Task
router.put(
  '/:projectId/tasks/:taskId',
  body('name').notEmpty().withMessage('El Nombre de la tarea es Obligatorio'),
  body('description')
    .notEmpty()
    .withMessage('La descripción de la tarea es obigatoria'),
  handleInputErrors,
  TaskController.updateTask
)

// Delete task
router.delete(
  '/:projectId/tasks/:taskId',
  TaskController.deleteTask
)

// Update task state
router.post('/:projectId/tasks/:taskId/status',
  body('status')
    .notEmpty().withMessage('El estado es obligatorio'),
  handleInputErrors,
  TaskController.updateStatus
)

export default router
 