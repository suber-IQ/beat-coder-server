import express from 'express';
import { registerValidation } from '../../validations/auth/register.validation';
import { validateRequest } from '../../middleware/validation.middleware';
import { loginValidation } from '../../validations/auth/login.validation';
import { isAuthenticate } from '../../middleware/is.authenticate';
import { login, logout, refreshToken, register } from '../../controllers/auth/auth.controller';

const authRoutes = express.Router();

authRoutes.post('/register', registerValidation, validateRequest, register);
authRoutes.get('/refresh-token', refreshToken);
authRoutes.post('/login',loginValidation,validateRequest, login);
authRoutes.post('/logout',isAuthenticate, logout);

export default authRoutes;
