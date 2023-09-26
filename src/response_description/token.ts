import { CODES } from "../utils/constants";
import { errorCodesDescription } from './index'

export const tokenResponseDescription = {
    200: {
        description: 'Returns all company tokens',
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
                        default: 'Tokens'
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
                                company_id: {
                                    type: 'string'
                                },
                                address: {
                                    type: 'string'
                                },
                                name: {
                                    type: 'string'
                                },
                                symbol: {
                                    type: 'string'
                                },
                                chainid: {
                                    type: 'string'
                                },
                                supply_type: {
                                    type: 'number'
                                },
                                max_supply: {
                                    type: 'string'
                                },
                                initial_supply: {
                                    type: 'string'
                                },
                                decimals: {
                                    type: 'number',
                                    default: 18
                                },
                                pausable: {
                                    type: 'boolean'
                                },
                                burnable: {
                                    type: 'boolean'
                                },
                                blacklist: {
                                    type: 'boolean'
                                },
                                recoverable: {
                                    type: 'boolean'
                                },
                                verified: {
                                    type: 'boolean'
                                },
                                fpmanager: {
                                    type: 'string'
                                },
                                image: {
                                    type: 'string'
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

export const tokenAddResponseDescription = {
    200: {
        description: 'Returns created token',
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
                        default: 'The token was successfully added'
                    },
                    type: {
                        type: 'string',
                        default: 'object'
                    },
                    data: {
                        type: 'object',
                        properties: {
                            company_id: {
                                type: 'string'
                            },
                            address: {
                                type: 'string'
                            },
                            name: {
                                type: 'string'
                            },
                            symbol: {
                                type: 'string'
                            },
                            chainid: {
                                type: 'string'
                            },
                            supply_type: {
                                type: 'number'
                            },
                            max_supply: {
                                type: 'string'
                            },
                            initial_supply: {
                                type: 'string'
                            },
                            decimals: {
                                type: 'number',
                                default: 18
                            },
                            pausable: {
                                type: 'boolean'
                            },
                            burnable: {
                                type: 'boolean'
                            },
                            blacklist: {
                                type: 'boolean'
                            },
                            recoverable: {
                                type: 'boolean'
                            },
                            verified: {
                                type: 'boolean'
                            },
                            fpmanager: {
                                type: 'string'
                            },
                            image: {
                                type: 'string'
                            }
                        }
                    }
                }
            }
        }
    },
    ...errorCodesDescription
}