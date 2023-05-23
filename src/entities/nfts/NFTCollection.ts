export interface NFTCollection {
    company_id: string,
    name: string,
    symbol: string,
    description: string,
    logo_image: string,
    featured_image: string,
    banner_image: string,
    chainid: string,
    address: string,
    beneficiary: string,
    royalty_percent: number,
    pausable: boolean,
    burnable: boolean,
    mintable: boolean,
    ownable: boolean,
    roles: boolean,
    uri_storage: boolean,
    image: string,
}