import { Request, Response } from "express";
import User from "../../models/userModel";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.exists({ email });

    if (!userExists) {
      const encryptedPassword: String = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        password: encryptedPassword,
      });

      const token = jwt.sign(
        {
          userId: user._id,
          email,
        },
        process.env.SECRET_KEY || "",
        {
          expiresIn: "24h",
        }
      );

      res
        .status(201)
        .json({ message: "User creation successfull", username, email, token });
      return;
    }
    res.status(409).json({
      message:
        "Cannot use same email for multiple users, please try registering with a different email.",
    });
  } catch (err) {
    res.status(500).json({ message: `User creation failed due to: ${err}` });
  }
};

export default registerController;
