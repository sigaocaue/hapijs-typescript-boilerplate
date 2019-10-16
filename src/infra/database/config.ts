import { ConnectionOptions } from 'typeorm'
import * as path from 'path'

const options: ConnectionOptions[] = [
  {
    name: process.env.MYSQL_CONNECTION_NAME || 'mysql',
    type: 'mysql',
    host: process.env.MYSQL_HOST || 'mysql',
    port: Number(process.env.MYSQL_PORT) || 3306,
    database: process.env.MYSQL_DATABASE || 'app',
    username: process.env.MYSQL_USERNAME || 'app ',
    password: process.env.MYSQL_PASSWORD || 'app@mysql',
    entities: [path.join(process.cwd(), 'dist/api/**/model/*.js')],
    synchronize: true,
  },
  {
    name: process.env.POSTGRES_CONNECTION_NAME || 'postgres',
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'postgres',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    database: process.env.POSTGRES_DATABASE || 'app',
    username: process.env.POSTGRES_USERNAME || 'app',
    password: process.env.POSTGRES_PASSWORD || 'app@postgres',
    entities: [path.join(process.cwd(), 'dist/api/**/model/*.js')],
    synchronize: true,
  },
]

const databasesDefault: string[] = process.env.DB_CONNECTIONS.split(',') || [
  'mongodb',
]

const optionsDefault: ConnectionOptions[] = options.filter(
  option => !!databasesDefault.find(database => database === option.type)
)

export default optionsDefault
