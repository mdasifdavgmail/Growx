// routes/userRoutes.js
const express = require('express');
const { register, login, uploadAssignment, getAdmins } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/upload', authMiddleware('user'), uploadAssignment);
router.get('/admins', getAdmins);

module.exports = router;
