"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateResponseDescription = exports.userDeleteResponseDescription = exports.userAddResponseDescription = exports.usersResponseDescription = void 0;
const constants_1 = require("../utils/constants");
const index_1 = require("./index");
exports.usersResponseDescription = Object.assign({ 200: {
        description: 'Returns all company users',
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
                        default: 'Users'
                    },
                    type: {
                        type: 'string',
                        default: 'array'
                    },
                    data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string'
                                },
                                external_id: {
                                    type: 'string'
                                },
                                email: {
                                    type: 'string'
                                },
                                wallet: {
                                    type: 'string'
                                },
                                image: {
                                    type: 'string'
                                },
                                notes: {
                                    type: 'string'
                                },
                                'properties': {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            name: { type: 'string' },
                                            value: { type: 'string' }
                                        }
                                    }
                                },
                                stats: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            name: { type: 'string' },
                                            value: { type: 'number' }
                                        }
                                    }
                                },
                                nft_rewards: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            reward_name: { type: 'string' },
                                            nft_name: { type: 'string' },
                                            collection_name: { type: 'string' },
                                            count: { type: 'number' },
                                        }
                                    }
                                },
                                token_rewards: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            token_name: { type: 'string' },
                                            reward_name: { type: 'string' },
                                            count: { type: 'number' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } }, index_1.errorCodesDescription);
exports.userAddResponseDescription = Object.assign({ 200: {
        description: 'Returns created user',
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
                        default: 'The user was successfully added'
                    },
                    type: {
                        type: 'string',
                        default: 'object'
                    },
                    data: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string'
                            },
                            external_id: {
                                type: 'string'
                            },
                            email: {
                                type: 'string'
                            },
                            wallet: {
                                type: 'string'
                            },
                            image: {
                                type: 'string'
                            },
                            notes: {
                                type: 'string'
                            },
                            'properties': {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        value: { type: 'string' }
                                    }
                                }
                            },
                            stats: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        value: { type: 'number' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } }, index_1.errorCodesDescription);
exports.userDeleteResponseDescription = Object.assign({ 200: {
        description: 'Returns if user is deleted',
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
                        default: 'The user was successfully deleted'
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
exports.userUpdateResponseDescription = Object.assign({ 200: {
        description: 'Returns if user data is updated',
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
                        default: 'The user was successfully updated'
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
