const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const { verifyJWT } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

router.post('/register', verifyJWT, body('fullName').trim().isLength({ min: 2, max: 80 }).withMessage('A valid full name is required'), validate, registerUser);
router.post('/login', verifyJWT, loginUser);
router.post('/logout', verifyJWT, logoutUser);

module.exports = router;
