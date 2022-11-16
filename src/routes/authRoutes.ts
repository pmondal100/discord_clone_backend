import express from 'express';
import authControllers from '../controllers/authControllers';
import Joi from 'joi';
import expressJoiValidator from 'express-joi-validation'
import verifyJWT from '../customMiddlewares/auth';

const validator = expressJoiValidator.createValidator({});

const registerSchema = Joi.object({
    username: Joi.string().min(3).max(12).required(),
    password: Joi.string().min(6).max(12).required(),
    email: Joi.string().email().required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(12).required()
});

const router = express.Router();

router.use(express.json());

router.post('/registerUser', validator.body(registerSchema), authControllers.registerController);

router.post('/loginUser', validator.body(loginSchema), authControllers.loginController);

router.get('/test', verifyJWT, (req: any, res) => {
    res.status(201).json({ message: `User authentication successfull.`, data: req.user });
})

module.exports = router;