import { FastifyInstance } from "fastify";
import { SignUp } from "./auth/SignUp";
import { SignIn } from "./auth/SignIn";
export { SignUpValidation } from './auth/SignUp'
export { SignInValidation } from './auth/SignIn'

export function addSchemas(app: FastifyInstance) {
    app.addSchema(SignUp)
    app.addSchema(SignIn)
}