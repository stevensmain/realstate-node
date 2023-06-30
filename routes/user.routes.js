import express from 'express'
import {
  confirmUser,
  formForgotPassword,
  formLogin,
  formRegister,
  register,
  resetPassword,
  validateRegister
} from '../controllers/user.controller.js'

const router = express.Router()

router.get('/login', formLogin)

router.get('/register', formRegister)
router.post('/register', validateRegister, register)

router.get('/confirm/:token', confirmUser)

router.get('/forgot-password', formForgotPassword)
router.post('/forgot-password', resetPassword)

export default router
