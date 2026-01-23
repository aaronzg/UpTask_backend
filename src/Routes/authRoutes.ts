import { Router } from 'express'
import { body, param } from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputErrors } from '../middleware/validation'

const router = Router()

router.post(
  '/create-account',
  body('name').notEmpty().withMessage('El nombre no puede estar vacio'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres'),
  body('password_       confirmation').custom((value, { req }) => {
    if (value !== req.body.password)
      throw new Error('Las contraseñas no coinciden')
    return true
  }),
  body('email').isEmail().withMessage('Email no valido'),
  handleInputErrors,
  AuthController.createAcount,
)

router.post(
  '/confirm-account',
  body('token').notEmpty().withMessage('El token no puede ir vacio'),
  handleInputErrors,
  AuthController.confirmAccount,
)

router.post(
  '/login',
  body('email').isEmail().withMessage('Email no valido'),
  body('password').notEmpty().withMessage('La contrseña no puede estar vacia'),
  handleInputErrors,
  AuthController.login,
)

router.post(
  '/request-code',
  body('email').isEmail().withMessage('Email no valido'),
  handleInputErrors,
  AuthController.requestConfirmationCode,
)

router.post(
  '/forgot-password',
  body('email').isEmail().withMessage('E-mail no valido'),
  handleInputErrors,
  AuthController.forgotPassword,
)

router.post(
  '/validate-token',
  body('token').notEmpty().withMessage('El token no puede ir vacio'),
  handleInputErrors,
  AuthController.validateToken,
)

router.post(
  '/reset-password/:token',
  param('token').isNumeric().withMessage('Token no valido'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres'),
  body('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password)
      throw new Error('Las contraseñas no coinciden')
    return true
  }),
  handleInputErrors,
  AuthController.resetPasswordWithToken,
)

export default router
