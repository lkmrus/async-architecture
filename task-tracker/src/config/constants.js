import yaml from './ymlConfig'

export const NODE_ENV = process.env.NODE_ENV ?? 'development'

export const APP_PORT = Number(yaml.app?.port) ?? 3000
export const APP_HOST = yaml.app?.host ?? 'localhost'
export const LOG_LEVEL = yaml.app?.logLevel ?? 'info'

export const DB = yaml.db

export const RABBIT_CONNECTION = yaml.rabbitConnectionUrl || 'amqp://localhost:5672'

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  ACCOUNTANT: 'accountant',
  USER: 'user',
}

export const CLIENT_TYPES = {
  GUEST: 'guest',
  APP: 'app',
  USER: 'user',
}

export const SERVICES = {
  AUTH_URL: yaml.services?.authUrl,
}

export const BULL = {
  REDIS_URL: yaml.bull.redisUrl,
  PREFIX: yaml.bull.prefix,
}

export default {
  NODE_ENV,
  CLIENT_TYPES,
  APP_HOST,
  APP_PORT,
  DB,
  LOG_LEVEL,
  RABBIT_CONNECTION,
  ROLES,
  SERVICES,
}
