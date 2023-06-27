import express from 'express'
import {
  formForgotPassword,
  formLogin,
  formRegister,
  register
} from '../controllers/user.controller.js'

const router = express.Router()

router.get('/login', formLogin)

router.get('/register', formRegister)
router.post('/register', register)

router.get('/forgot-password', formForgotPassword)

export default router
