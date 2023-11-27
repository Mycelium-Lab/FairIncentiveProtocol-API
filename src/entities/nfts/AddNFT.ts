import { Property, Stat } from "../users/User"

export interface AddNFT {
    address: string,
    image?: string,
    image_json?: string,
    chainid: string,
    amount?: number
    name?: string,
    description?: string,
    properties?: Array<Property>,
    stats?: Array<Stat>
}