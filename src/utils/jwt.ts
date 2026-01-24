import jwt from 'jsonwebtoken'

export const generateJWT = () => {
  const data = {
    name: 'User1'
  }
  const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '6m' })

  return token
}