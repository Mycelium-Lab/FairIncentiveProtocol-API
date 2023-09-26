import { CODES } from "../utils/constants";
import { errorCodesDescription } from './index'

export const companyResponseDescription = {
    200: {
        description: 'Returns company data',
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
                        default: 'Company'
                    },
                    type: {
                        type: 'string',
                        default: 'object'
                    },
                    data: {
                        type: 'object',
                        properties: {
                            name: {type: 'string'},
                            email: {type: 'string'},
                            phone: {type: 'string'},
                            wallet: {type: 'string'}
                        }
                    }
                }
            }
        }
    },
    ...errorCodesDescription
}

export const changeNameResponseDescription = {
    200: {
        description: 'Updates company name',
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
                        default: 'Company name has been successfully updated'
                    },
                    type: {
                        type: 'string',
                        default: 'null'
                    },
                    data: {
                        type: 'null'
                    }
                }
            }
        }
    },
    ...errorCodesDescription
}

export const changeEmailResponseDescription = {
    200: {
        description: 'Updates company email',
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
                        default: 'Company email has been successfully updated'
                    },
                    type: {
                        type: 'string',
                        default: 'null'
                    },
                    data: {
                        type: 'null'
                    }
                }
            }
        }
    },
    ...errorCodesDescription
}

export const changePhoneResponseDescription = {
    200: {
        description: 'Updates company phone',
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
                        default: 'Company phone has been successfully updated'
                    },
                    type: {
                        type: 'string',
                        default: 'null'
                    },
                    data: {
                        type: 'null'
                    }
                }
            }
        }
    },
    ...errorCodesDescription
}

export const changeWalletResponseDescription = {
    200: {
        description: 'Updates company wallet',
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
                        default: 'Company wallet has been successfully updated'
                    },
                    type: {
                        type: 'string',
                        default: 'null'
                    },
                    data: {
                        type: 'null'
                    }
                }
            }
        }
    },
    ...errorCodesDescription
}

export const changePasswordResponseDescription = {
    200: {
        description: 'Updates company password',
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
                        default: 'Company password has been successfully updated'
                    },
                    type: {
                        type: 'string',
                        default: 'null'
                    },
                    data: {
                        type: 'null'
                    }
                }
            }
        }
    },
    ...errorCodesDescription
}