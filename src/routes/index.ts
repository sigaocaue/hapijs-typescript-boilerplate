import * as Hapi from '@hapi/hapi'
import * as path from 'path'
import * as Glob from 'glob'
import Logger from '../helper/logger'

export interface Route {
  register(server: Hapi.Server): Promise<any>
}

export default class Router {
  public static async loadRoutes(server: Hapi.Server): Promise<void> {
    const files = Glob.sync(path.join(__dirname, '../**/router/index.js'))

    Logger.info({
      user: 'system',
      message: 'Router - Start adding routes',
    })

    for (const file of files) {
      try {
        Logger.info({
          user: 'system',
          message: `Router: Registering the file: ${file}.`,
        })
        const route = await import(file)
        await new route.default().register(server)
      } catch (err) {
        Logger.error({
          user: 'system',
          message: `Router: Can't import file: ${err.message}`,
        })
      }
    }
    Logger.info({
      user: 'system',
      message: 'Router: Finish adding routes',
    })
  }
}
