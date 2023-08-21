export interface JWTPayload {
    email?: string,
    phone?: string,
    company_id?: string,
    address?: string,
    randomNumber?: number,
    company: boolean 
}