export interface User {
    id?: string,
    external_id: string,
    email:  string,
    wallet:  string,
    notes?: string,
    properties?: Array<Property>,
    stats?: Array<Stat>
}

interface Property {
    name: string,
    value: string,
    user_id?: string,
    company_id?: string
}

interface Stat {
    name: string,
    value: number,
    user_id?: string,
    company_id?: string
}