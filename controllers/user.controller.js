import { check, validationResult } from 'express-validator'
import User from '../models/User.js'
import { generateId } from '../helpers/tokens.js'
import { registerEmail } from '../helpers/emails.js'

const formLogin = (req, res) => {
  res.render('auth/login', {
    title: 'Login'
  })
}
const formRegister = (req, res) => {
  res.render('auth/register', {
    title: 'Create a new account'
  })
}

const register = async (req, res) => {
  const { body } = req
  const { email, password, name } = body

  // Validate
  await check('name').notEmpty().withMessage('Name is required').run(req)
  await check('email').isEmail().withMessage('Email is invalid').run(req)
  await check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .run(req)
  await check('password2')
    .equals(password)
    .withMessage('Passwords must be equals')
    .run(req)

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const errorMessages = {}

    for (const error of errors.array()) {
      errorMessages[error.path] = error.msg
    }

    return res.render('auth/register', {
      title: 'Create a new account',
      errors: errorMessages,
      user: {
        name,
        email
      }
    })
  }

  const userExists = await User.findOne({ where: { email: req.body.email } })

  if (userExists) {
    return res.render('auth/register', {
      title: 'Create a new account',
      errors: { auth: 'Usuario ya registrado' },
      user: {
        name,
        email
      }
    })
  }

  // Create new user
  const user = await User.create({
    name,
    password,
    email,
    token: generateId()
  })

  // Send verification email
  await registerEmail({
    name: user.name,
    email: user.email,
    token: user.token
  })

  return res.render('templates/message', {
    title: 'Successful register',
    msg: 'We have send you an mail to your email address, please click on the link'
  })
}

const formForgotPassword = (req, res) => {
  res.render('auth/forgot-password', {
    title: 'Recovert your password'
  })
}

export { formLogin, formRegister, register, formForgotPassword }
