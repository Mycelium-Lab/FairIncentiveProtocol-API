import { FastifyInstance } from "fastify";
import { SignUp } from "./auth/SignUp";
import { SignIn } from "./auth/SignIn";
import { ChangeCompanyName } from "./company/name";
import { ChangeCompanyEmail } from "./company/email";
import { ChangeCompanyPassword } from "./company/password";
import { ChangeCompanyPhone } from "./company/phone";
import { ChangeCompanyWallet } from "./company/wallet";
export { SignUpValidation } from './auth/SignUp'
export { SignInValidation } from './auth/SignIn'
export { ChangeCompanyNameValidation } from './company/name'
export { ChangeCompanyEmailValidation } from './company/email'
export { ChangeCompanyPasswordValidation } from "./company/password";
export { ChangeCompanyPhoneValidation } from "./company/phone";
export { ChangeCompanyWalletValidation } from "./company/wallet";

export function addSchemas(app: FastifyInstance) {
    app.addSchema(SignUp)
    app.addSchema(SignIn)
    app.addSchema(ChangeCompanyName)
    app.addSchema(ChangeCompanyEmail)
    app.addSchema(ChangeCompanyPassword)
    app.addSchema(ChangeCompanyPhone)
    app.addSchema(ChangeCompanyWallet)
}