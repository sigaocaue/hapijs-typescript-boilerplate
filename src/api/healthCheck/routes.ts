import * as Hapi from '@hapi/hapi'
import { Route } from '../../routes'
import HelthCheckController from './controller'

export default class HealthCheckRoutes implements Route {
  public async register(server: Hapi.Server): Promise<any> {
    const controller = new HelthCheckController()
    return new Promise(resolve => {
      server.route([
        {
          method: 'GET',
          path: '/',

          options: {
            handler: controller.get,
            description: 'Method that get Health Check for application.',
            tags: ['api', 'health-check'],
            auth: false,
          },
        },
        {
          method: 'GET',
          path: '/api/health-check',

          options: {
            handler: controller.get,
            description: 'Method that get Health Check for application.',
            tags: ['api', 'health-check'],
            auth: false,
          },
        },
        {
          method: 'GET',
          path: '/api/v2/health-check',

          options: {
            handler: controller.get,
            description: 'Method that get Health Check for application.',
            tags: ['api', 'health-check'],
            auth: false,
          },
        },
        {
          method: 'GET',
          path: '/health-check',

          options: {
            handler: controller.get,
            description: 'Method that get Health Check for application.',
            tags: ['api', 'health-check'],
            auth: false,
          },
        },
        {
          method: 'GET',
          path: '/helthcheck',

          options: {
            handler: controller.get,
            description: 'Method that get Health Check for application.',
            tags: ['api', 'health-check'],
            auth: false,
          },
        },
      ])
      resolve()
    })
  }
}
