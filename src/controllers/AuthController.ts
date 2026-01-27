import { type Request, type Response } from 'express'
import User from '../Models/User'
import { hashPassword } from '../utils/auth'
import { generateToken } from '../utils/token'
import Token from '../Models/Token'
import { AuthEmail } from '../emails/AuthEmail'
import { compare } from 'bcrypt'
import { generateJWT } from '../utils/jwt'

export class AuthController {
  static createAcount = async (req: Request, res: Response) => {
    try {
      const { password, email, name } = req.body
      // Prevent duplicated users
      const userExists = await User.findOne({ email })
      if (userExists)
        return res.status(409).json({ error: 'El usuario ya esta registrado' })

      const nameInUse = await User.findOne({ name })
      if (nameInUse)
        return res
          .status(409)
          .json({ error: 'El nombre de usuario ya esta en uso' })
      // Create new User
      const user = new User(req.body)

      // hash password
      user.password = await hashPassword(password)

      // Generate the verification token and save it in the DB
      const token = new Token({
        token: generateToken(),
        user: user._id,
      })
      // Send email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      })

      await Promise.allSettled([user.save(), token.save()])
      res.send('Cuenta creada correctamente, revisa tu email para confirmarla')
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body
      const tokenExists = await Token.findOne({ token })

      if (!tokenExists) return res.status(404).json({ error: 'Token invalido' })

      // Confirm user and delete the token
      const user = await User.findById(tokenExists.user)
      user.confirmed = true
      await Promise.allSettled([user.save(), tokenExists.deleteOne()])
      res.send('Cuenta confirmada correctamente')
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email })

      // Validate that the user exists and is confirmed
      if (!user) return res.status(404).json({ error: 'Usario no encontrado' })
      if (!user.confirmed) {
        const token = new Token({
          user: user._id,
          token: generateToken(),
        })
        await token.save()

        // Send email
        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        })

        return res.status(401).json({
          error:
            'La cuenta no ha sido confirmada, hemos enviado un nuevo email de confirmación',
        })
      }

      // Validate password
      const isPasswordCorrect = await compare(password, user.password)
      if (!isPasswordCorrect)
        res.status(401).json({ error: 'Contraseña incorrecta' })

      // Create a sesion
      const token = generateJWT({ id: user.id })
      res.send('JWT: ' + token)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Hubo un error' })
    }
  }

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body

      // Verify if the user exists
      const user = await User.findOne({ email })
      if (!user)
        return res.status(404).json({ error: 'El usuario no esta registrado' })

      // Verify if the user is already confirmed
      if (user.confirmed)
        return res.status(403).json({ error: 'El usuario ya esta confirmado' })

      // Generate the verification token and save it in the DB
      const token = new Token({
        token: generateToken(),
        user: user._id,
      })
      // Send email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      })
      await token.save()
      res.send(
        'Se envio un nuevo token correctamente, revisa tu email para confirmarla',
      )
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Hubo un error' })
    }
  }
  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body

      // Verify if the user exists
      const user = await User.findOne({ email })
      if (!user)
        return res.status(404).json({ error: 'El usuario no esta registrado' })

      // Generate the verification token and save it in the DB
      const token = new Token({
        token: generateToken(),
        user: user._id,
      })

      await token.save()

      // Send email
      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token,
      })

      res.send('Revisa tu email para restablecer tu contraseña')
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Hubo un error' })
    }
  }

  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body
      const tokenExists = await Token.findOne({ token })
      console.log(tokenExists, token)

      // Invalid token
      if (!tokenExists) return res.status(404).json({ error: 'Token invalido' })

      // Valid Token
      res.send('Token valido. Define tu nueva contraseña')
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }

  static resetPasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params
      // Check if the token exists
      const tokenExists = await Token.findOne({ token })
      if (!tokenExists) return res.status(404).json({ error: 'Token invalido' })

      // Update password
      const { password } = req.body // Get the password
      const user = await User.findById(tokenExists.user) // Get the user

      user.password = await hashPassword(password) // hash password

      // Save the new password and delete the token
      
      await Promise.allSettled([tokenExists.deleteOne(), user.save()])

      res.send('Se restablecio tu contraseña correctamente')
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }
}
