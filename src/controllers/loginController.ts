import { Request, Response } from "express"
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const loginController = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if(user && (await bcrypt.compare(password, (user.password || '')))){
            const token = jwt.sign({
                userId: user._id,
                email
            },
            process.env.SECRET_KEY || '',
            {
                expiresIn: "24h"
            });

            res.status(201).json({
                message: 'Login Successfull.',
                token,
                username: user.username,
                email: user.email
            })

            return;
        }

        res.status(401).send('Invalid credentials.');
        return;
    }
    catch(err){
        res.status(500).json({ message: 'Internal server error.'});
    }
}

export default loginController;