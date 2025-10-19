import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

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
router.use('/:id', param('id').isMongoId().withMessage('ID no valido'), handleInputErrors)

// Get Project by id
router.get('/:id', 
  ProjectController.getProjectById)
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

export default router 