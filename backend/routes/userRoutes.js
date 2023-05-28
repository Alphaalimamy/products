import express from 'express';
import { getUsers, login, register, deleteUser } from '../controller/UserController.js';


const router = express.Router();

router.post('/register', register).post('/login', login)
router.delete('/:id', deleteUser)
router.get('/', getUsers)

export default router