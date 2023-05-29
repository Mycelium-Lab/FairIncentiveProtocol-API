import { utils } from 'ethers'

const chainids = ['137', '80001', '56', '1', '43114', '42161', '10']

export function checkAddress(wallet: string, helpers: any) {
    if (!helpers.schema._valids._values.has(null)) {
        if (wallet === '') throw Error("Wallet can't be null")
        const _isAddress = utils.isAddress(wallet)
        if (!_isAddress) {
            throw Error('Wallet is incorrect')
        }
    }
}

export function checkChainID(chainid: string, helpers: any) {
    if (!chainids.find(v => v === chainid)) {
        throw Error('Unknown (chainid) for the application, use these: 137 (Polygon), 56 (BNB), 1 (Ethereum), 43114 (Avalanche), 42161 (Arbitrum), 10 (Optimism)')
    }
}