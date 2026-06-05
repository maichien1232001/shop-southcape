import { Router } from 'express';
import { register, login, forgotPassword, resetPassword, getProfile, refresh, logout } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh', refresh);
router.post('/logout', requireAuth, logout);
router.get('/profile', requireAuth, getProfile);

export default router;
