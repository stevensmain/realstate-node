import { check, validationResult } from 'express-validator'
import User from '../models/User.js'

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
  // Validate
  await check('name').notEmpty().withMessage('Name is required').run(req)
  await check('email').isEmail().withMessage('Email is invalid').run(req)
  await check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .run(req)
  await check('password2')
    .equals('password')
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
        name: req.body.name,
        email: req.body.email
      }
    })
  }

  const user = await User.create(req.body)
  res.json(user)
}

const formForgotPassword = (req, res) => {
  res.render('auth/forgot-password', {
    title: 'Recovert your password'
  })
}

export { formLogin, formRegister, register, formForgotPassword }
