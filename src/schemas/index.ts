import { FastifyInstance } from "fastify";
import { SignUp } from "./auth/SignUp";
import { SignIn } from "./auth/SignIn";
import { ChangeCompanyName } from "./company/name";
import { ChangeCompanyEmail } from "./company/email";
import { ChangeCompanyPassword } from "./company/password";
import { ChangeCompanyPhone } from "./company/phone";
import { ChangeCompanyWallet } from "./company/wallet";
import { AddUser } from "./users/add";
import { DeleteUser } from "./users/delete";
import { AddToken } from "./tokens/add";
import { AddNFT } from './nfts/add'
import { AddTokenReward } from "./rewards/addToken";
import { DeleteReward } from "./rewards/delete";
export { SignUpValidation } from './auth/SignUp'
export { SignInValidation } from './auth/SignIn'
export { ChangeCompanyNameValidation } from './company/name'
export { ChangeCompanyEmailValidation } from './company/email'
export { ChangeCompanyPasswordValidation } from "./company/password";
export { ChangeCompanyPhoneValidation } from "./company/phone";
export { ChangeCompanyWalletValidation } from "./company/wallet";
export { AddUserValidation } from './users/add'
export { DeleteUserValidation } from './users/delete'
export { AddTokenValidation } from './tokens/add'
export { AddNFTValidation } from './nfts/add'
export { AddTokenRewardValidation } from './rewards/addToken'
export { DeleteRewardValidation } from "./rewards/delete";

export function addSchemas(app: FastifyInstance) {
    app.addSchema(SignUp)
    app.addSchema(SignIn)
    app.addSchema(ChangeCompanyName)
    app.addSchema(ChangeCompanyEmail)
    app.addSchema(ChangeCompanyPassword)
    app.addSchema(ChangeCompanyPhone)
    app.addSchema(ChangeCompanyWallet)
    app.addSchema(AddUser)
    app.addSchema(DeleteUser)
    app.addSchema(AddToken)
    app.addSchema(AddNFT)
    app.addSchema(AddTokenReward)
    app.addSchema(DeleteReward)
}