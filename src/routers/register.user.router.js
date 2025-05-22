import express from 'express';
import { registerUser } from '../controllers/auth.controller.js'; // Contrôleur

const router = express.Router();

// Route d'inscription
router.post('/register', registerUser);



export default router;
