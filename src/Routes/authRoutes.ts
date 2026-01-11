import { Router } from 'express'
import { body } from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputErrors } from '../middleware/validation'

const router = Router()

router.get(
  '/create-account',
  body('name').notEmpty().withMessage('El nombre no puede estar vacio'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres'),
  body('password-confirmation').custom((value, { req }) => {
    if (value !== req.body.password)
      throw new Error('Las contraseñas no coinciden')
    return true
  }),
  body('email').isEmail().withMessage('Email no valido'),
  handleInputErrors,
  AuthController.createAcount
)

router.post(
  '/confirm-account',
  body('token').notEmpty().withMessage('El token no puede ir vacio'),
  handleInputErrors,
  AuthController.confirmAccount
)

router.get(
  '/login',
  body('email').isEmail().withMessage('Email no valido'),
  body('name').notEmpty().withMessage('El nombre no puede estar vacio'),
  body('password')
    .notEmpty().withMessage('La contrseña no puede estar vacia'),
  handleInputErrors,
  AuthController.login
)

export default router
