import { RewardTokenEvent, Token, TokenReward, User } from "./index"

export interface ErrorResponse {
    code: number,
    error: Err
}

interface Err {
    name: string,
    message: string
}

export interface SuccessResponse {
    code: number,
    body: {
        message: string,
        type: string,
        data?: any
    }
}