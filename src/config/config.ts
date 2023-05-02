import dotenv from 'dotenv'
import { Config } from '../entities'

dotenv.config()

export const config: Config = {
    PORT: parseInt(process.env.PORT || '3000'),
    SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || '13'),
    SECRET_KEY: process.env.SECRET_KEY || 'SECRET_KEY',
    DB_CONNECTION: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}` || ''
}
