import { utils } from 'ethers'

export function checkAddress(wallet: string, helpers: any) {
    if (!helpers.schema._valids._values.has(null)) {
        const _isAddress = utils.isAddress(wallet)
        if (!_isAddress) {
            throw Error('Wallet is incorrect')
        }
    }
}