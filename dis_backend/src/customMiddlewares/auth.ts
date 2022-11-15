import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const verifyJWT = (req: any, res: Response, next: NextFunction) => {
  let token =
    req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    res
      .status(403)
      .json({ message: "A token is required for authentication." });
    return;  
  }

  try{
    token = token.replace(/^Bearer\s+/, "");
    const decoded = jwt.verify(token, process.env.SECRET_KEY || "");
    req['user'] = decoded
  }catch(err){
    res.status(403).json({ message: 'Invalid token.' });
    return;
  }
  return next();
};

export default verifyJWT;
