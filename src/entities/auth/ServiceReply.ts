export interface AuthServiceReply {
    isError: boolean,
    code: number,
    data: Data,
    res: {
        message: string
    }
}

interface Data {
    company_id?: string,
    address?: string
}