import { CODES } from "../utils/constants";

export const signupResponseDecription = {
    200: {
        description: 'Returns created company id',
        type: 'object',
        properties: {
            code: {
                type: 'number',
                default: CODES.OK.code
            },
            body: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                        default: 'The company was successfully added'
                    },
                    type: {
                        type: 'string'
                    },
                    data: {
                        type: 'string'
                    }
                }
            }
        }
    },
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

export const signinResponseDescription = {
    200: {
        description: 'Returns company_id and jwt_token',
        type: 'object',
        properties: {
            code: {
                type: 'number',
                default: CODES.OK.code
            },
            body: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                        default: 'Password is ok'
                    },
                    type: {
                        type: 'string',
                        default: 'object'
                    },
                    data: {
                        type: 'object',
                        properties: {
                            company_id: {type: 'string'},
                            address: {type: 'string'},
                            token: {type: 'string'}
                        }
                    }
                }
            }
        }
    },
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