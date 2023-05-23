export interface AddNFTCollection {
    company_id?: string,
    address: string,
    name: string,
    symbol: string,
    description?: string,
    chainid: string,
    beneficiary?: string,
    royalties: number,
    links: Array<Link>
}

export interface Link {
    company_id?: string
    token_address?: string
    chainid?: string
    link: string
}