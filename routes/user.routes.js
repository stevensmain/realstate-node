import express from 'express'
import {
  changePassword,
  confirmToken,
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

router.get('/forgot-password/:token', confirmToken)
router.post('/forgot-password/:token', changePassword)

export default router
