import * as Hapi from '@hapi/hapi'
import Plugin from '../plugin'
import Router from '../routes'
import Logger from '../helper/logger'
import Db from '../infra/database'

export default class Server {
  private static _instance: Hapi.Server

  public static async start(): Promise<Hapi.Server> {
    try {
      const host = this.serverHost()
      const port = this.serverPort()
      Server._instance = new Hapi.Server({
        port,
        routes: {
          cors: {
            origin: ['*'], // an array of origins or 'ignore'
            headers: ['Authorization'], // an array of strings - 'Access-Control-Allow-Headers'
            exposedHeaders: ['Accept'], // an array of exposed headers - 'Access-Control-Expose-Headers',
            additionalExposedHeaders: ['Accept'], // an array of additional exposed headers
            maxAge: 60,
            credentials: true, // boolean - 'Access-Control-Allow-Credentials'
          },
        },
      })

      await Plugin.registerAll(Server._instance)
      await Db.createConnections()
      await Router.loadRoutes(Server._instance)

      Logger.info(
        JSON.stringify({
          user: 'system',
          message: `Server - Up and running at http://${host}:${port}`,
        })
      )

      await Server._instance.start()

      return Server._instance
    } catch (error) {
      Logger.error(
        JSON.stringify({
          user: 'system',
          message: `Server - There was something wrong: ${error}`,
        })
      )
      throw error
    }
  }

  public static serverPort(): number {
    return typeof process.env.NODE_PORT !== 'undefined'
      ? Number(process.env.NODE_PORT)
      : 3000
  }

  public static serverHost(): string {
    return process.env.SERVER_HOST || 'localhost'
  }
}
