import Joi  from 'joi'
import { utils } from 'ethers'

export const ChangeCompanyWallet: unknown = {
    $id: 'ChangeCompanyWallet',
    type: 'object',
    properties: {
        newWallet: {
            type: 'string'
        }
    }
}

export const ChangeCompanyWalletValidation: Joi.ObjectSchema = Joi.object({
    newWallet: Joi.string()
        .allow('')
        .external(checkAddress)
})

function checkAddress(wallet: string) {
    const _isAddress = utils.isAddress(wallet)
    if (!_isAddress) {
        throw Error('Wallet is incorrect')
    }
}