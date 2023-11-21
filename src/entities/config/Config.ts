export interface Config {
    PORT: number,
    SALT_ROUNDS: number,
    SECRET_KEY: string,
    DB_CONNECTION: string,
    NFT_STORAGE_KEY: string,
    networks: Array<Network>
}

export interface Network {
    name: string,
    chainid: string,
    rpc: string,
    private_key: string
}
