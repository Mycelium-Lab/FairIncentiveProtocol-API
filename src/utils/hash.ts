import bcrypt from 'bcrypt'
import { config } from '../config/config'

const saltRounds: number = config.SALT_ROUNDS

export async function hash(password: string): Promise<string | null> {
    try {
        const hashed = await bcrypt.hash(password, saltRounds)
        return hashed
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function compare(password: string, hash: string): Promise<boolean | null> {
    try {
        const check = await bcrypt.compare(password, hash)
        return check
    } catch (error) {
        return null
    }
}
