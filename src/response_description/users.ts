import { CODES } from "../utils/constants";
import { errorCodesDescription } from './index'

export const usersResponseDescription = {
    200: {
        description: 'Returns all company users',
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
                                            name: {type: 'string'},
                                            value: {type: 'string'}
                                        }
                                    }
                                },
                                stats: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            name: {type: 'string'},
                                            value: {type: 'number'}
                                        }
                                    }
                                },
                                nft_rewards: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            reward_name: {type: 'string'},
                                            nft_name: {type: 'string'},
                                            collection_name: {type: 'string'},
                                            count: {type: 'number'},
                                        }
                                    }
                                },
                                token_rewards: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            token_name: {type: 'string'},
                                            reward_name: {type: 'string'},
                                            count: {type: 'number'}
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    ...errorCodesDescription
}

export const userAddResponseDescription = {
    200: {
        description: 'Returns created user',
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
                                        name: {type: 'string'},
                                        value: {type: 'string'}
                                    }
                                }
                            },
                            stats: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        name: {type: 'string'},
                                        value: {type: 'number'}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    ...errorCodesDescription
}

export const userDeleteResponseDescription = {
    200: {
        description: 'Returns if user is deleted',
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
    },
    ...errorCodesDescription
}

export const userUpdateResponseDescription = {
    200: {
        description: 'Returns if user data is updated',
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
    },
    ...errorCodesDescription
}