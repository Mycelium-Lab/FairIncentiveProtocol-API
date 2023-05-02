export interface AuthServiceReply {
    isError: boolean,
    code: number,
    res: {
        message: string
    }
}