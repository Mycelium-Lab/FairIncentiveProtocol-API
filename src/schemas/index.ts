import { FastifyInstance } from "fastify";
import { SignUp } from "./auth/SignUp";
import { SignIn } from "./auth/SignIn";
import { ChangeCompanyName } from "./company/name";
import { ChangeCompanyEmail } from "./company/email";
import { ChangeCompanyPassword } from "./company/password";
import { ChangeCompanyPhone } from "./company/phone";
import { ChangeCompanyWallet } from "./company/wallet";
import { AddUser } from "./users/add";
import { AddToken } from "./tokens/add";
import { AddNFTCollection } from './nfts/addCollection'
import { AddTokenReward } from "./rewards/addToken";
import { Delete } from "./common/Delete";
import { RewardWithToken } from './rewards/rewardWithToken'
import { AddNFT } from './nfts/addNFT'
import { AddNFTReward } from './rewards/addNFT'
import { UpdateTokenReward } from './rewards/updateTokenReward'
import { UpdateNFTReward } from './rewards/updateNFTReward'
import { UpdateUser } from './users/update'
import { Status } from './rewards/status'
export { SignUpValidation } from './auth/SignUp'
export { SignInValidation } from './auth/SignIn'
export { ChangeCompanyNameValidation } from './company/name'
export { ChangeCompanyEmailValidation } from './company/email'
export { ChangeCompanyPasswordValidation } from "./company/password";
export { ChangeCompanyPhoneValidation } from "./company/phone";
export { ChangeCompanyWalletValidation } from "./company/wallet";
export { AddUserValidation } from './users/add'
export { AddTokenValidation } from './tokens/add'
export { AddNFTCollectionValidation } from './nfts/addCollection'
export { AddTokenRewardValidation } from './rewards/addToken'
export { DeleteValidation } from "./common/Delete";
export { RewardWithTokenValidation } from './rewards/rewardWithToken'
export { AddNFTValidation } from './nfts/addNFT'
export { AddNFTRewardValidation } from './rewards/addNFT'
export { UpdateTokenRewardValidation } from './rewards/updateTokenReward'
export { UpdateNFTRewardValidation } from './rewards/updateNFTReward'
export { UpdateUserValidation } from './users/update'
export { StatusValidation } from './rewards/status'

export function addSchemas(app: FastifyInstance) {
    app.addSchema(SignUp)
    app.addSchema(SignIn)
    app.addSchema(ChangeCompanyName)
    app.addSchema(ChangeCompanyEmail)
    app.addSchema(ChangeCompanyPassword)
    app.addSchema(ChangeCompanyPhone)
    app.addSchema(ChangeCompanyWallet)
    app.addSchema(AddUser)
    app.addSchema(AddToken)
    app.addSchema(AddNFTCollection)
    app.addSchema(AddTokenReward)
    app.addSchema(Delete)
    app.addSchema(RewardWithToken)
    app.addSchema(AddNFT)
    app.addSchema(AddNFTReward)
    app.addSchema(UpdateTokenReward)
    app.addSchema(UpdateNFTReward)
    app.addSchema(UpdateUser)
    app.addSchema(Status)
}