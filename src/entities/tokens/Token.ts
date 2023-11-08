export interface Token {
    company_id?: string,
    address: string,
    name: string,
    symbol: string,
    chainid: string,
    supply_type: number,
    max_supply?: string,
    initial_supply?: string,
    decimals?: number,
    pausable: boolean,
    burnable: boolean,
    blacklist: boolean,
    recoverable: boolean,
    verified: boolean,
    fpmanager: string,
    image?: string,
    supply_type_name?: string
}