/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from '@ioc:Adonis/Core/Env'
import { OrmConfig } from '@ioc:Adonis/Lucid/Orm'
import Application from '@ioc:Adonis/Core/Application'
import { DatabaseConfig } from '@ioc:Adonis/Lucid/Database'

const databaseConfig: DatabaseConfig & { orm: Partial<OrmConfig> } = {
  connection: Env.get('DB_CONNECTION'),
  connections: {
    pg: {
      client: 'pg',
      connection: {
        host: Env.get('DB_HOST'),
        port: Env.get('DB_PORT'),
        user: Env.get('DB_USER'),
        password: Env.get('DB_PASSWORD'),
        database: Env.get('DB_NAME'),
      },
      healthCheck: false,
    },
  },

  orm: {},
}

export default databaseConfig
