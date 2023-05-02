import knex, { Knex } from 'knex'
import { config } from './config'

const pg: Knex = knex({
    client: 'pg',
    connection: config.DB_CONNECTION
})

export default pg