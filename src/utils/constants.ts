export const CODES = {
    OK: {
        code: 200,
        name: 'OK'
    },
    BAD_REQUEST: {
        code: 400,
        name: 'Bad Request'
    },
    UNAUTHORIZED: {
        code: 401,
        name: 'Unauthorized'
    },
    NOT_FOUND: {
        code: 404,
        name: 'Not found'
    },
    INTERNAL_ERROR: {
        code: 500,
        name: 'Internal Server Error'
    }
}

export const SuccessResponseTypes = {
    object: 'object',
    array: 'array<object>',
    string: 'string',
    number: 'number',
    nullType: 'null'
}

export const CODES_RANGES = {
    OK: {
        min: 200,
        max: 299
    },
    CLIENT_ERROR: {
        min: 400,
        max: 499
    },
    SERVER_ERROR: {
        min: 500,
        max: 599
    }
}