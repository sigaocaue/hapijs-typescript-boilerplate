import * as Hapi from '@hapi/hapi'
import Logger from 'helper/logger'

export default class Plugins {
  public static async registerAll(server: Hapi.Server): Promise<Error | void> {
    await Plugins.blipp(server)
    const appEnv = process.env.NODE_ENV || 'local'
    if (appEnv !== 'local') {
      await Plugins.status(server)
      await Plugins.swagger(server)
    }
  }

  public static async blipp(server: Hapi.Server): Promise<Error | void> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      await Plugins.register(server, await import('blipp'))
    } catch (error) {
      Logger.error(
        JSON.stringify({
          user: 'system',
          message: `Plugins - Ups, something went wrong when registering blipp plugin: ${error}`,
        })
      )
    }
  }

  public static async status(server: Hapi.Server): Promise<Error | any> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const plugin = await import('hapijs-status-monitor')
      await Plugins.register(server, {
        options: {
          path: '/status',
          title: 'My Status Monitor',
          routeConfig: {
            auth: false,
          },
        },
        plugin,
      })
    } catch (error) {
      Logger.error(
        JSON.stringify({
          user: 'system',
          message: `Plugins - Ups, something went wrong when registering hapijs-status-monitor plugin: ${error}`,
        })
      )
    }
  }

  public static async swagger(server: Hapi.Server): Promise<Error | any> {
    try {
      Logger.info(
        JSON.stringify({
          user: 'system',
          message: 'Plugins - Registering swagger-ui',
        })
      )
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const plugin = await import('hapi-swagger')
      const vision = await import('@hapi/vision')
      const inert = await import('@hapi/inert')

      await Plugins.register(server, [
        inert,
        vision,
        {
          options: {
            documentationPath: '/docs',
            info: {
              title: 'API Documentation',
              version: 'v1.0.0',
              contact: {
                name: 'Caue Prado',
                email: 'caue.prado@carenet.com.br',
              },
            },
            grouping: 'tags',
            sortEndpoints: 'ordered',
          },
          plugin,
        },
      ])
    } catch (error) {
      Logger.error(
        `Plugins - Ups, something went wrong when registering swagger-ui plugin: ${error}`
      )
    }
  }

  private static async register(
    server: Hapi.Server,
    plugin: any
  ): Promise<void> {
    return new Promise(resolve => {
      resolve(server.register(plugin))
    })
  }
}
