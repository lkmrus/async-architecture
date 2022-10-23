import { DB, } from './constants'

export const sample = {
  username: DB.user,
  password: DB.pass,
  database: DB.name,
  host: DB.host,
  port: DB.port,
  dialect: 'postgres',
}

export const development = sample
export const test = sample
export const production = sample

export default DB
