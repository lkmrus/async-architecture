import logger from './logger'
import * as auth from './auth'

export const eventDataBuilder = (req, response, additionalData = {}) => {
  return {
    ...additionalData,
    userId: req?.user?.id,
    taskId: response?.id,
    publicId: response?.publicId,
    request: req.body,
    response,
    date: new Date(),
  }
}

export {
  logger,
  auth,
}
