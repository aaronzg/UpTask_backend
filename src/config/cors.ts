import { CorsOptions } from "cors";
import { isClassStaticBlockDeclaration } from "typescript";

export const corsConfig : CorsOptions = {
  origin: function (origin, callback) {
    const whitelist = [process.env.FRONTEND_URL]
    if(whitelist.includes(origin) || process.argv[2] === '--api') {
      callback(null, true)
    } else {
      callback(new Error('Error de CORS'), false)
    }
  }
}