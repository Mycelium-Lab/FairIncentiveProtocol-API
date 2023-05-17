"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSchemas = exports.UpdateUserValidation = exports.UpdateNFTRewardValidation = exports.UpdateTokenRewardValidation = exports.AddNFTRewardValidation = exports.AddNFTValidation = exports.RewardWithTokenValidation = exports.DeleteRewardValidation = exports.AddTokenRewardValidation = exports.AddNFTCollectionValidation = exports.AddTokenValidation = exports.DeleteUserValidation = exports.AddUserValidation = exports.ChangeCompanyWalletValidation = exports.ChangeCompanyPhoneValidation = exports.ChangeCompanyPasswordValidation = exports.ChangeCompanyEmailValidation = exports.ChangeCompanyNameValidation = exports.SignInValidation = exports.SignUpValidation = void 0;
const SignUp_1 = require("./auth/SignUp");
const SignIn_1 = require("./auth/SignIn");
const name_1 = require("./company/name");
const email_1 = require("./company/email");
const password_1 = require("./company/password");
const phone_1 = require("./company/phone");
const wallet_1 = require("./company/wallet");
const add_1 = require("./users/add");
const delete_1 = require("./users/delete");
const add_2 = require("./tokens/add");
const addCollection_1 = require("./nfts/addCollection");
const addToken_1 = require("./rewards/addToken");
const delete_2 = require("./rewards/delete");
const rewardWithToken_1 = require("./rewards/rewardWithToken");
const addNFT_1 = require("./nfts/addNFT");
const addNFT_2 = require("./rewards/addNFT");
const updateTokenReward_1 = require("./rewards/updateTokenReward");
const updateNFTReward_1 = require("./rewards/updateNFTReward");
const update_1 = require("./users/update");
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
var delete_3 = require("./users/delete");
Object.defineProperty(exports, "DeleteUserValidation", { enumerable: true, get: function () { return delete_3.DeleteUserValidation; } });
var add_4 = require("./tokens/add");
Object.defineProperty(exports, "AddTokenValidation", { enumerable: true, get: function () { return add_4.AddTokenValidation; } });
var addCollection_2 = require("./nfts/addCollection");
Object.defineProperty(exports, "AddNFTCollectionValidation", { enumerable: true, get: function () { return addCollection_2.AddNFTCollectionValidation; } });
var addToken_2 = require("./rewards/addToken");
Object.defineProperty(exports, "AddTokenRewardValidation", { enumerable: true, get: function () { return addToken_2.AddTokenRewardValidation; } });
var delete_4 = require("./rewards/delete");
Object.defineProperty(exports, "DeleteRewardValidation", { enumerable: true, get: function () { return delete_4.DeleteRewardValidation; } });
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
function addSchemas(app) {
    app.addSchema(SignUp_1.SignUp);
    app.addSchema(SignIn_1.SignIn);
    app.addSchema(name_1.ChangeCompanyName);
    app.addSchema(email_1.ChangeCompanyEmail);
    app.addSchema(password_1.ChangeCompanyPassword);
    app.addSchema(phone_1.ChangeCompanyPhone);
    app.addSchema(wallet_1.ChangeCompanyWallet);
    app.addSchema(add_1.AddUser);
    app.addSchema(delete_1.DeleteUser);
    app.addSchema(add_2.AddToken);
    app.addSchema(addCollection_1.AddNFTCollection);
    app.addSchema(addToken_1.AddTokenReward);
    app.addSchema(delete_2.DeleteReward);
    app.addSchema(rewardWithToken_1.RewardWithToken);
    app.addSchema(addNFT_1.AddNFT);
    app.addSchema(addNFT_2.AddNFTReward);
    app.addSchema(updateTokenReward_1.UpdateTokenReward);
    app.addSchema(updateNFTReward_1.UpdateNFTReward);
    app.addSchema(update_1.UpdateUser);
}
exports.addSchemas = addSchemas;
