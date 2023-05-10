import dotenv from 'dotenv'
import { Config } from '../entities'

dotenv.config()

export const config: Config = {
    PORT: parseInt(process.env.PORT || '3000'),
    SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || '13'),
    SECRET_KEY: process.env.SECRET_KEY || 'SECRET_KEY',
    DB_CONNECTION: 
    process.env.STATUS === "prod"
    ?
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`
    :
    `postgresql://${process.env.TEST_DB_USER}:${process.env.TEST_DB_PASSWORD}@${process.env.TEST_DB_HOST}/${process.env.TEST_DB_NAME}`
}
