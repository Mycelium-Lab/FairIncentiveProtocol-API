"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordResponseDescription = exports.changeWalletResponseDescription = exports.changePhoneResponseDescription = exports.changeEmailResponseDescription = exports.changeNameResponseDescription = exports.companyResponseDescription = void 0;
const constants_1 = require("../utils/constants");
const index_1 = require("./index");
exports.companyResponseDescription = Object.assign({ 200: {
        description: 'Returns company data',
        type: 'object',
        properties: {
            code: {
                type: 'number',
                default: constants_1.CODES.OK.code
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
                            name: { type: 'string' },
                            email: { type: 'string' },
                            phone: { type: 'string' },
                            wallet: { type: 'string' }
                        }
                    }
                }
            }
        }
    } }, index_1.errorCodesDescription);
exports.changeNameResponseDescription = Object.assign({ 200: {
        description: 'Updates company name',
        type: 'object',
        properties: {
            code: {
                type: 'number',
                default: constants_1.CODES.OK.code
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
    } }, index_1.errorCodesDescription);
exports.changeEmailResponseDescription = Object.assign({ 200: {
        description: 'Updates company email',
        type: 'object',
        properties: {
            code: {
                type: 'number',
                default: constants_1.CODES.OK.code
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
    } }, index_1.errorCodesDescription);
exports.changePhoneResponseDescription = Object.assign({ 200: {
        description: 'Updates company phone',
        type: 'object',
        properties: {
            code: {
                type: 'number',
                default: constants_1.CODES.OK.code
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
    } }, index_1.errorCodesDescription);
exports.changeWalletResponseDescription = Object.assign({ 200: {
        description: 'Updates company wallet',
        type: 'object',
        properties: {
            code: {
                type: 'number',
                default: constants_1.CODES.OK.code
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
    } }, index_1.errorCodesDescription);
exports.changePasswordResponseDescription = Object.assign({ 200: {
        description: 'Updates company password',
        type: 'object',
        properties: {
            code: {
                type: 'number',
                default: constants_1.CODES.OK.code
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
    } }, index_1.errorCodesDescription);
