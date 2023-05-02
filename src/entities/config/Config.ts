export interface Config {
    PORT: number,
    SALT_ROUNDS: number,
    SECRET_KEY: string,
    DB_CONNECTION: string
}