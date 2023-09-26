import { CODES } from "../utils/constants"

export const authorizationTokenDescription = {
    type: 'object',
    properties: {
        Authorization: {
            type: 'string',
            description: 'Bearer token for authentication'
        }
    }
} 

export const errorCodesDescription = {
    400: {
        description: CODES.BAD_REQUEST.name,
        type: 'object',
        properties: {
            code: {
                type: 'number',
                default: CODES.BAD_REQUEST.code
            },
            error: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        default: CODES.BAD_REQUEST.name
                    },
                    message: {
                        type: 'string'
                    }
                }
            }
        }
    },
    401: {
        description: CODES.UNAUTHORIZED.name,
        type: 'object',
        properties: {
            code: {
                type: 'number',
                default: CODES.UNAUTHORIZED.code
            },
            error: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        default: CODES.UNAUTHORIZED.name
                    },
                    message: {
                        type: 'string'
                    }
                }
            }
        }
    },
    404: {
        description: CODES.NOT_FOUND.name,
        type: 'object',
        properties: {
            code: {
                type: 'number',
                default: CODES.NOT_FOUND.code
            },
            error: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        default: CODES.NOT_FOUND.name
                    },
                    message: {
                        type: 'string'
                    }
                }
            }
        }
    },
    500: {
        description: CODES.INTERNAL_ERROR.name,
        type: 'object',
        properties: {
            code: {
                type: 'number',
                default: CODES.INTERNAL_ERROR.code
            },
            error: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        default: CODES.INTERNAL_ERROR.name
                    },
                    message: {
                        type: 'string'
                    }
                }
            }
        }
    }
}