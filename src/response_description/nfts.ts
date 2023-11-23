import { CODES } from "../utils/constants";
import { errorCodesDescription } from './index'

export const nftCollectionsResponseDescription = {
    200: {
        description: 'Returns all company NFT Collections',
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
                        default: 'NFT Collections'
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
                                name: {
                                    type: 'string'
                                },
                                'symbol': {
                                    type: 'string'
                                },
                                description: {
                                    type: 'string'
                                },
                                logo_image: {
                                    type: 'string'
                                },
                                featured_image: {
                                    type: 'string'
                                },
                                banner_image: {
                                    type: 'string'
                                },
                                chainid: {
                                    type: 'string'
                                },
                                address: {
                                    type: 'string'
                                },
                                beneficiary: {
                                    type: 'string'
                                },
                                royalty_percent: {
                                    type: 'number'
                                },
                                pausable: {
                                    type: 'boolean'
                                },
                                burnable: {
                                    type: 'boolean'
                                },
                                mintable: {
                                    type: 'boolean'
                                },
                                ownable: {
                                    type: 'boolean'
                                },
                                roles: {
                                    type: 'boolean'
                                },
                                uri_storage: {
                                    type: 'boolean'
                                },
                                image: {
                                    type: 'string'
                                },
                                nft_count: {
                                    type: 'number'
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

export const nftsResponseDescription = {
    200: {
        description: 'Returns all company NFTs',
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
                        default: 'NFTs grouped by collections with reward count'
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
                                collection_address: {
                                    type: 'string'
                                },
                                collection_name: {
                                    type: 'string'
                                },
                                nfts: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'string'
                                            },
                                            image: {
                                                type: 'string'
                                            },
                                            name: {
                                                type: 'string'
                                            },
                                            description: {
                                                type: 'string'
                                            },
                                            amount: {
                                                type: 'number'
                                            }, 
                                            count: {
                                                type: 'number'
                                            },
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

export const collectionAddResponseDescription = {
    200: {
        description: 'Returns created NFT Collection',
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
                        default: 'The NFT collection was successfully added'
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
                            name: {
                                type: 'string'
                            },
                            'symbol': {
                                type: 'string'
                            },
                            description: {
                                type: 'string'
                            },
                            logo_image: {
                                type: 'string'
                            },
                            featured_image: {
                                type: 'string'
                            },
                            banner_image: {
                                type: 'string'
                            },
                            chainid: {
                                type: 'string'
                            },
                            address: {
                                type: 'string'
                            },
                            beneficiary: {
                                type: 'string'
                            },
                            royalty_percent: {
                                type: 'number'
                            },
                            pausable: {
                                type: 'boolean'
                            },
                            burnable: {
                                type: 'boolean'
                            },
                            mintable: {
                                type: 'boolean'
                            },
                            ownable: {
                                type: 'boolean'
                            },
                            roles: {
                                type: 'boolean'
                            },
                            uri_storage: {
                                type: 'boolean'
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

export const nftAddResponseDescription = {
    200: {
        description: 'Returns created NFT',
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
                        default: 'The NFT was successfully added'
                    },
                    type: {
                        type: 'string',
                        default: 'object'
                    },
                    data: {
                        type: 'object',
                        properties: {
                            address: {
                                type: 'string'
                            },
                            image: {
                                type: 'string'
                            },
                            amount: {
                                type: 'number'
                            },
                            name: {
                                type: 'string'
                            },
                            description: {
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

export const nftsDeleteResponseDescription = {
    200: {
        description: 'Returns if NFT is deleted',
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
                        default: 'The NFT was successfully deleted'
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