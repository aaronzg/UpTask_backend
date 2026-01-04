import { Router } from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";

const router = Router()

router.get('/create-account', 
  body('name')
  .notEmpty().withMessage('El nombre no puede estar vacio'),
  body('password')
  .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
  body('password-confirmation')
  .custom((value, { req }) => {
    if(value !== req.body.password) throw new Error('Las contraseñas no coinciden')
    return true
  }),
  body('email')
  .isEmail().withMessage('Email no valido'),
  handleInputErrors,
  AuthController.createAcount)

export default router