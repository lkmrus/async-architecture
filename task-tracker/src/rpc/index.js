import { subscribe, } from './RabbitService'
import { workerCreateUser, workerTaskShuffle, } from './workers'
import { logger, } from '../common/utils'
import { ATTEMPT, } from 'Config/constants'
import { AppError, ValidationError, } from 'Exceptions'
import { checkSchema, } from 'SchemaRegistryLib'

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
    logger.error(`Attempt: ${attempt}. Error while handling ${message.pattern} event`, { e, attempt, eventName: message.pattern, })
    await fn(message)
    logger.log(`${message.pattern} event completed successfully`, { e, attempt, eventName: message.pattern, })
  }
}

const simpleHandler = (message = {}) => {
  checkSchema(message?.pattern, message)

  switch (message?.pattern) {
  case EVENTS.TASK_ASSIGNED:
    return errorHandler(message, workerTaskShuffle)
  case EVENTS.USER_REGISTERED:
    return errorHandler(message, workerCreateUser)
  default:
    throw new ValidationError(`Such a pattern does not exist. Received: ${message?.pattern ?? ''}`)
  }
}

(async () => {
  await subscribe(
    { exchangeName: EXCHANGES.BUSINESS_EVENTS, type: 'topic', },
    {
      queue: 'task-tracker',
      routingKeys: [
        'task.assigned',
        'task.completed',
        'user.registered'
      ],
      options: {
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
      queue: 'task-tracker',
      routingKeys: [],
      options: {
        durable: true,
        ['x-dead-letter-exchange']: `${EXCHANGES.CUD_EVENTS}.dlx`,
        ['x-dead-letter-routing-key']: 'task-tracker', },
    },
    simpleHandler,
    { noAck: false, }
  )
})()
