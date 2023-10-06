"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nftsDeleteResponseDescription = exports.nftAddResponseDescription = exports.collectionAddResponseDescription = exports.nftsResponseDescription = exports.nftCollectionsResponseDescription = void 0;
const constants_1 = require("../utils/constants");
const index_1 = require("./index");
exports.nftCollectionsResponseDescription = Object.assign({ 200: {
        description: 'Returns all company NFT Collections',
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
                                }
                            }
                        }
                    }
                }
            }
        }
    } }, index_1.errorCodesDescription);
exports.nftsResponseDescription = Object.assign({ 200: {
        description: 'Returns all company NFTs',
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
    } }, index_1.errorCodesDescription);
exports.collectionAddResponseDescription = Object.assign({ 200: {
        description: 'Returns created NFT Collection',
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
    } }, index_1.errorCodesDescription);
exports.nftAddResponseDescription = Object.assign({ 200: {
        description: 'Returns created NFT',
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
    } }, index_1.errorCodesDescription);
exports.nftsDeleteResponseDescription = Object.assign({ 200: {
        description: 'Returns if NFT is deleted',
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
    } }, index_1.errorCodesDescription);
