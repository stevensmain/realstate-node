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
    title: 'Create a new account',
    csrf: req.csrfToken()
  })
}

const register = async (req, res) => {
  const { email, password, name } = req.body

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

const validateRegister = async (req, res, next) => {
  const { email, password, name } = req.body

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
      csrf: req.csrfToken(),
      user: {
        name,
        email
      }
    })
  }

  const user = await User.findOne({ where: { email: req.body.email } })

  if (user) {
    return res.render('auth/register', {
      title: 'Create a new account',
      errors: { auth: 'User already registered' },
      csrf: req.csrfToken(),
      user: {
        name,
        email
      }
    })
  }

  next()
}

const confirmUser = async (req, res) => {
  const { token } = req.params

  const user = await User.findOne({ where: { token } })

  if (!user) {
    return res.render('auth/confirm-account', {
      title: 'Account confirmation failed',
      msg: 'There was an error confirming your account, please try again',
      error: true
    })
  }

  // Confirm account
  user.token = null
  user.confirm = true
  await user.save()

  return res.render('auth/confirm-account', {
    title: 'Account confirmed',
    msg: 'Account confirmed successfully',
    error: false
  })
}

const formForgotPassword = (req, res) => {
  res.render('auth/forgot-password', {
    title: 'Recovert your password',
    csrf: req.csrfToken()
  })
}

const resetPassword = async (req, res) => {
  const { email } = req.body

  await check('email').isEmail().withMessage('Email is invalid').run(req)

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const errorMessages = {}

    for (const error of errors.array()) {
      errorMessages[error.path] = error.msg
    }

    return res.render('auth/forgot-password', {
      title: 'Recovert your password',
      errors: errorMessages,
      csrf: req.csrfToken()
    })
  }

  const user = await User.findOne({ where: { email } })

  if (!user) {
    console.log('User not found')
    return res.render('auth/forgot-password', {
      title: 'Recovert your password',
      errors: { auth: 'This email is not registered' },
      csrf: req.csrfToken()
    })
  }

  return res.render('auth/forgot-password')
}

export {
  formLogin,
  formRegister,
  register,
  formForgotPassword,
  confirmUser,
  validateRegister,
  resetPassword
}
