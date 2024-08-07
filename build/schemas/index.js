"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSchemas = exports.ForgotPassEmailValidation = exports.TokenForDistValidation = exports.UuidDateRangeValidation = exports.GetOneCollectionNftValidation = exports.DateRangeValidation = exports.ChangeCompanyRepnameValidation = exports.DeleteApiKeyValidation = exports.StatusValidation = exports.UpdateUserValidation = exports.UpdateNFTRewardValidation = exports.UpdateTokenRewardValidation = exports.AddNFTRewardValidation = exports.AddNFTValidation = exports.RewardWithTokenValidation = exports.UuidValidation = exports.AddTokenRewardValidation = exports.AddNFTCollectionValidation = exports.AddTokenValidation = exports.AddUserValidation = exports.ChangeCompanyWalletValidation = exports.ChangeCompanyPhoneValidation = exports.ChangeCompanyPasswordValidation = exports.ChangeCompanyEmailValidation = exports.ChangeCompanyNameValidation = exports.SignInValidation = exports.SignUpValidation = void 0;
const SignUp_1 = require("./auth/SignUp");
const SignIn_1 = require("./auth/SignIn");
const name_1 = require("./company/name");
const email_1 = require("./company/email");
const password_1 = require("./company/password");
const phone_1 = require("./company/phone");
const wallet_1 = require("./company/wallet");
const add_1 = require("./users/add");
const add_2 = require("./tokens/add");
const addCollection_1 = require("./nfts/addCollection");
const addToken_1 = require("./rewards/addToken");
const Uuid_1 = require("./common/Uuid");
const rewardWithToken_1 = require("./rewards/rewardWithToken");
const addNFT_1 = require("./nfts/addNFT");
const addNFT_2 = require("./rewards/addNFT");
const updateTokenReward_1 = require("./rewards/updateTokenReward");
const updateNFTReward_1 = require("./rewards/updateNFTReward");
const update_1 = require("./users/update");
const status_1 = require("./rewards/status");
const Delete_1 = require("./api_keys/Delete");
const repname_1 = require("./company/repname");
const dateRange_1 = require("./stat/dateRange");
const getOneCollectionNft_1 = require("./nfts/getOneCollectionNft");
const uuidDateRange_1 = require("./stat/uuidDateRange");
const tokenForDist_1 = require("./stat/tokenForDist");
const forgot_1 = require("./pass_reset/forgot");
var SignUp_2 = require("./auth/SignUp");
Object.defineProperty(exports, "SignUpValidation", { enumerable: true, get: function () { return SignUp_2.SignUpValidation; } });
var SignIn_2 = require("./auth/SignIn");
Object.defineProperty(exports, "SignInValidation", { enumerable: true, get: function () { return SignIn_2.SignInValidation; } });
var name_2 = require("./company/name");
Object.defineProperty(exports, "ChangeCompanyNameValidation", { enumerable: true, get: function () { return name_2.ChangeCompanyNameValidation; } });
var email_2 = require("./company/email");
Object.defineProperty(exports, "ChangeCompanyEmailValidation", { enumerable: true, get: function () { return email_2.ChangeCompanyEmailValidation; } });
var password_2 = require("./company/password");
Object.defineProperty(exports, "ChangeCompanyPasswordValidation", { enumerable: true, get: function () { return password_2.ChangeCompanyPasswordValidation; } });
var phone_2 = require("./company/phone");
Object.defineProperty(exports, "ChangeCompanyPhoneValidation", { enumerable: true, get: function () { return phone_2.ChangeCompanyPhoneValidation; } });
var wallet_2 = require("./company/wallet");
Object.defineProperty(exports, "ChangeCompanyWalletValidation", { enumerable: true, get: function () { return wallet_2.ChangeCompanyWalletValidation; } });
var add_3 = require("./users/add");
Object.defineProperty(exports, "AddUserValidation", { enumerable: true, get: function () { return add_3.AddUserValidation; } });
var add_4 = require("./tokens/add");
Object.defineProperty(exports, "AddTokenValidation", { enumerable: true, get: function () { return add_4.AddTokenValidation; } });
var addCollection_2 = require("./nfts/addCollection");
Object.defineProperty(exports, "AddNFTCollectionValidation", { enumerable: true, get: function () { return addCollection_2.AddNFTCollectionValidation; } });
var addToken_2 = require("./rewards/addToken");
Object.defineProperty(exports, "AddTokenRewardValidation", { enumerable: true, get: function () { return addToken_2.AddTokenRewardValidation; } });
var Uuid_2 = require("./common/Uuid");
Object.defineProperty(exports, "UuidValidation", { enumerable: true, get: function () { return Uuid_2.UuidValidation; } });
var rewardWithToken_2 = require("./rewards/rewardWithToken");
Object.defineProperty(exports, "RewardWithTokenValidation", { enumerable: true, get: function () { return rewardWithToken_2.RewardWithTokenValidation; } });
var addNFT_3 = require("./nfts/addNFT");
Object.defineProperty(exports, "AddNFTValidation", { enumerable: true, get: function () { return addNFT_3.AddNFTValidation; } });
var addNFT_4 = require("./rewards/addNFT");
Object.defineProperty(exports, "AddNFTRewardValidation", { enumerable: true, get: function () { return addNFT_4.AddNFTRewardValidation; } });
var updateTokenReward_2 = require("./rewards/updateTokenReward");
Object.defineProperty(exports, "UpdateTokenRewardValidation", { enumerable: true, get: function () { return updateTokenReward_2.UpdateTokenRewardValidation; } });
var updateNFTReward_2 = require("./rewards/updateNFTReward");
Object.defineProperty(exports, "UpdateNFTRewardValidation", { enumerable: true, get: function () { return updateNFTReward_2.UpdateNFTRewardValidation; } });
var update_2 = require("./users/update");
Object.defineProperty(exports, "UpdateUserValidation", { enumerable: true, get: function () { return update_2.UpdateUserValidation; } });
var status_2 = require("./rewards/status");
Object.defineProperty(exports, "StatusValidation", { enumerable: true, get: function () { return status_2.StatusValidation; } });
var Delete_2 = require("./api_keys/Delete");
Object.defineProperty(exports, "DeleteApiKeyValidation", { enumerable: true, get: function () { return Delete_2.DeleteApiKeyValidation; } });
var repname_2 = require("./company/repname");
Object.defineProperty(exports, "ChangeCompanyRepnameValidation", { enumerable: true, get: function () { return repname_2.ChangeCompanyRepnameValidation; } });
var dateRange_2 = require("./stat/dateRange");
Object.defineProperty(exports, "DateRangeValidation", { enumerable: true, get: function () { return dateRange_2.DateRangeValidation; } });
var getOneCollectionNft_2 = require("./nfts/getOneCollectionNft");
Object.defineProperty(exports, "GetOneCollectionNftValidation", { enumerable: true, get: function () { return getOneCollectionNft_2.GetOneCollectionNftValidation; } });
var uuidDateRange_2 = require("./stat/uuidDateRange");
Object.defineProperty(exports, "UuidDateRangeValidation", { enumerable: true, get: function () { return uuidDateRange_2.UuidDateRangeValidation; } });
var tokenForDist_2 = require("./stat/tokenForDist");
Object.defineProperty(exports, "TokenForDistValidation", { enumerable: true, get: function () { return tokenForDist_2.TokenForDistValidation; } });
var forgot_2 = require("./pass_reset/forgot");
Object.defineProperty(exports, "ForgotPassEmailValidation", { enumerable: true, get: function () { return forgot_2.ForgotPassEmailValidation; } });
function addSchemas(app) {
    app.addSchema(SignUp_1.SignUp);
    app.addSchema(SignIn_1.SignIn);
    app.addSchema(name_1.ChangeCompanyName);
    app.addSchema(email_1.ChangeCompanyEmail);
    app.addSchema(password_1.ChangeCompanyPassword);
    app.addSchema(phone_1.ChangeCompanyPhone);
    app.addSchema(wallet_1.ChangeCompanyWallet);
    app.addSchema(add_1.AddUser);
    app.addSchema(add_2.AddToken);
    app.addSchema(addCollection_1.AddNFTCollection);
    app.addSchema(addToken_1.AddTokenReward);
    app.addSchema(Uuid_1.Uuid);
    app.addSchema(rewardWithToken_1.RewardWithToken);
    app.addSchema(addNFT_1.AddNFT);
    app.addSchema(addNFT_2.AddNFTReward);
    app.addSchema(updateTokenReward_1.UpdateTokenReward);
    app.addSchema(updateNFTReward_1.UpdateNFTReward);
    app.addSchema(update_1.UpdateUser);
    app.addSchema(status_1.Status);
    app.addSchema(Delete_1.DeleteApiKey);
    app.addSchema(repname_1.ChangeCompanyRepname);
    app.addSchema(dateRange_1.DateRange);
    app.addSchema(getOneCollectionNft_1.GetOneCollectionNft);
    app.addSchema(uuidDateRange_1.UuidDateRange);
    app.addSchema(tokenForDist_1.TokenForDist);
    app.addSchema(forgot_1.ForgotPassEmail);
}
exports.addSchemas = addSchemas;
