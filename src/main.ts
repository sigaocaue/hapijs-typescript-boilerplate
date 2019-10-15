import Server from './server'
import Logger from './helper/logger'
import * as DotEnv from 'dotenv'
;(async (): Promise<void> => {
  DotEnv.config()
  await Server.start()

  Logger.info({
    user: 'system',
    message: `Hapi server has been started at: http://${Server.serverHost()}:${Server.serverPort()}/`,
  })
  console.log(
    `Hapi server has been started at: http://${Server.serverHost()}:${Server.serverPort()}/`
  )
})()
