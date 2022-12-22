import { JwtPayload } from "jsonwebtoken";
import { apiUserDataStructure } from "../../utils/commonInterfaces";

declare global{
  namespace Express {
      interface Request {
          user: apiUserDataStructure
      }
  }
}
