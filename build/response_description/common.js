"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorCodesDescription = exports.authorizationTokenDescription = void 0;
const constants_1 = require("../utils/constants");
exports.authorizationTokenDescription = {
    type: 'object',
    properties: {
        Authorization: {
            type: 'string',
            description: 'Bearer token for authentication'
        }
    }
};
exports.errorCodesDescription = {
    400: {
        description: constants_1.CODES.BAD_REQUEST.name,
        type: 'object',
        properties: {
            code: {
                type: 'number',
                default: constants_1.CODES.BAD_REQUEST.code
            },
            error: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        default: constants_1.CODES.BAD_REQUEST.name
                    },
                    message: {
                        type: 'string'
                    }
                }
            }
        }
    },
    401: {
        description: constants_1.CODES.UNAUTHORIZED.name,
        type: 'object',
        properties: {
            code: {
                type: 'number',
                default: constants_1.CODES.UNAUTHORIZED.code
            },
            error: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        default: constants_1.CODES.UNAUTHORIZED.name
                    },
                    message: {
                        type: 'string'
                    }
                }
            }
        }
    },
    404: {
        description: constants_1.CODES.NOT_FOUND.name,
        type: 'object',
        properties: {
            code: {
                type: 'number',
                default: constants_1.CODES.NOT_FOUND.code
            },
            error: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        default: constants_1.CODES.NOT_FOUND.name
                    },
                    message: {
                        type: 'string'
                    }
                }
            }
        }
    },
    500: {
        description: constants_1.CODES.INTERNAL_ERROR.name,
        type: 'object',
        properties: {
            code: {
                type: 'number',
                default: constants_1.CODES.INTERNAL_ERROR.code
            },
            error: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        default: constants_1.CODES.INTERNAL_ERROR.name
                    },
                    message: {
                        type: 'string'
                    }
                }
            }
        }
    }
};
