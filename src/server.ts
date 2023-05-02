import { AppOptions, build } from './app'
import { pino } from 'pino'
import { config } from './config/config'

const options: AppOptions = {
  logger: pino()
}

async function start() {
  const PORT: number = config.PORT
  const server = await build(options)
  try {
    await server.listen({ port: PORT })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()