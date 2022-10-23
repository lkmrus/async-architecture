import { subscribe, } from './RabbitService'
import { workerCreateUser, workerTaskShuffle, } from './workers'
import { logger, } from '../common/utils'
import { ATTEMPT, } from 'Config/constants'
import { AppError, } from 'Exceptions'

export const EXCHANGES = {
  BUSINESS_EVENTS: 'business.events',
  CUD_EVENTS: 'cud.events',
}

export const EVENTS = {
  TASK_ASSIGNED: 'task.assigned',
  TASK_CREATED: 'task.created',
  TASK_COMPLETED: 'task.completed',
  TASKS_SHUFFLED: 'tasks.shuffled',
  USER_REGISTERED: 'user.registered',
}

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function errorHandler(message, fn) {
  let attempt = 0
  try {
    return fn(message)
  }
  catch (e) {
    attempt += 1
    if (attempt === ATTEMPT.COUNT) {
      throw new AppError(e)
    }
    await delay(ATTEMPT.DELAY_MS)
    logger.error(`Error while handling ${message.pattern} event`, { e, attempt, eventName: message.pattern, })
    await errorHandler(message, fn)
    logger.log(`${message.pattern} event completed successfully`, { e, attempt, eventName: message.pattern, })
  }
}

const simpleHandler = message => {
  switch (message.pattern) {
  case EVENTS.TASK_ASSIGNED:
    return errorHandler(message, workerTaskShuffle)
  case EVENTS.USER_REGISTERED:
    return errorHandler(message, workerCreateUser)
  default:
    return
  }
}

(async () => {
  // Event subscriptions
  // TODO Доработать создание биндингов
  await subscribe(
    { exchangeName: EXCHANGES.BUSINESS_EVENTS, type: 'topic', },
    {
      queue: 'task-tracker', routingKey: '*', options: {
        durable: true,
        ['x-dead-letter-exchange']: `${EXCHANGES.BUSINESS_EVENTS}.dlx`,
        ['x-dead-letter-routing-key']: 'task-tracker', },
    },
    simpleHandler,
    { noAck: false, }
  )

  await subscribe(
    { exchangeName: EXCHANGES.CUD_EVENTS, type: 'topic', },
    {
      queue: 'task-tracker', routingKey: '*', options: {
        durable: true,
        ['x-dead-letter-exchange']: `${EXCHANGES.CUD_EVENTS}.dlx`,
        ['x-dead-letter-routing-key']: 'task-tracker', },
    },
    simpleHandler,
    { noAck: false, }
  )
})()
