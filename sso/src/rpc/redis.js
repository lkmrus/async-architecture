import Redis from 'ioredis'
import { BULL, } from 'Config/constants'

export default new Redis(BULL.REDIS_URL, {
  connectionName: 'sso',
})
