import * as Hapi from '@hapi/hapi'
import Plugin from '../plugin'
import Router from '../routes/router'
import Logger from '../helper/logger'
import Mongoose from 'mongoose'
import DatabaseConfig from '../infra/database/config'
import DatabaseDefault from '../infra/database/default'

export default class Server {
  private static _instance: Hapi.Server
  public static initializeDb(): Promise<Mongoose.Mongoose> {
    Mongoose.Promise = global.Promise
    Mongoose.connection.on('error', error => {
      Logger.error({
        user: 'system',
        message: `Mongo Database has not connected, because was error. The error is ${error}`,
      })
    })

    Mongoose.connection.once('open', () => {
      Logger.info({
        user: 'system',
        message: `Mongo Database connected.`,
      })
    })
    return Mongoose.connect(DatabaseConfig.url(), DatabaseConfig.options())
  }

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
      await Router.loadRoutes(Server._instance)
      await this.initializeDb()
      const dbDefault = new DatabaseDefault()
      await dbDefault.run()

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

  public static stop(): Promise<Error | void> {
    return Server._instance.stop()
  }

  public static async recycle(): Promise<Hapi.Server> {
    await Server.stop()
    return await Server.start()
  }

  public static instance(): Hapi.Server {
    return Server._instance
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
