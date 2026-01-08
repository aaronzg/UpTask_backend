import type { Request, Response } from "express"
import User from "../Models/User"
import { hashPassword } from "../utils/auth"
import { generateToken } from "../utils/token"
import Token from "../Models/Token"
import { transporter } from "../config/nodemailer"

export class AuthController {
  static createAcount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body
      // Prevent duplicated users
      const userExists = await User.findOne({ email })
      if(userExists) return res.status(409).json({ error: 'El usuario ya esta registrado' })

      // Create new User
      const user = new User(req.body)

      // hash password
      user.password = await hashPassword(password)

      // Generate the verification token and save it in the DB
      const token = new Token({
        token: generateToken(),
        user: user._id
      })
      // Send Email
      await transporter.sendMail({
        from: 'UpTask <admin@uptask.com>',
        to: user.email,
        subject: ' UpTask - Confirma tu cuenta',
        text: 'UpTask - Confirma tu cuenta',
        html: `<p>Probando email e-mail</p>`
      })

      await Promise.allSettled([user.save(), token.save()])
      res.send('Cuenta creada, revisa tu e-mail para confirmarla')
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }
}

