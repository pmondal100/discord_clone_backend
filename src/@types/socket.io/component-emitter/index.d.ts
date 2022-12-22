import { apiUserDataStructure } from "../../../utils/commonInterfaces"

declare global {
    namespace SocketIO {
      interface Socket {
        user?: apiUserDataStructure
      }
    }
  }