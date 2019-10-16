import { createConnections } from 'typeorm'
import Logger from '../../helper/logger'
import Config from './config'
import Model from '../../api/healthCheck/model'

export default class Database {
  public static createConnections = async (): Promise<void> => {
    try {
      await createConnections(Config)
      const category1 = new Model()
      category1.firstName = 'Caue'
      category1.lastName = 'Prado'
      category1.isActive = true
      await category1.save()
    } catch (error) {
      Logger.error({
        user: 'system',
        message: error.message,
      })
      throw error
    }
  }
}
