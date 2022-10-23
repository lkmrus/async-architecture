import pino from 'pino'
import { constants, } from 'Config'

export default pino({
  prettyPrint: { colorize: true, },
  level: constants.LOG_LEVEL,
})
