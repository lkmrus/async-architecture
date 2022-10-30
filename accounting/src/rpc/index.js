import { subscribe, } from './RabbitService'
import {
  addTaskCostWorker,
  createBillWorker,
  depositTransactionWorker,
  sendMailWorker,
  withdrawTransactionWorker,
} from './workers'
import { logger, } from 'Utils'
import { ATTEMPT, } from 'Config/constants'
import { ValidationError, } from 'Exceptions'
import { checkSchema, } from 'SchemaRegistryLib'

export const EXCHANGES = {
  BUSINESS_EVENTS: 'business.events',
  CUD_EVENTS: 'cud.events',
}

export const EVENTS = {
  TASK_ASSIGNED: 'task.assigned',
  TASK_COST_SET: 'task.cost.set',
  WITHDRAW_APPLIED: 'withdraw.applied',
  DEPOSIT_APPLIED: 'deposit.applied',
  TASK_CREATED: 'task.created',
  TASK_COMPLETED: 'task.completed',
  TASKS_SHUFFLED: 'tasks.shuffled',
  USER_REGISTERED: 'user.registered',
  DAILY_MONEY_CALCULATED: 'daily.money.calculated',
  EMAIL_SENT: 'email.sent',
  BALANCE_CLEARED: 'balance.cleared',
  BILL_CREATED: 'bill.created',
}

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function errorHandler(message, fn) {
  let attempt = 0
  try {
    await fn(message)
    logger.log(`${message.pattern} event completed successfully`, { e, attempt, eventName: message.pattern, })
  }
  catch (e) {
    attempt += 1
    if (attempt === ATTEMPT.COUNT) {
      return
    }
    await delay(ATTEMPT.DELAY_MS)
    logger.error(`Error while handling ${message.pattern} event`, { e, attempt, eventName: message.pattern, })
    await fn(message)
  }
}

const simpleHandler = (message = {}) => {
  checkSchema(message?.pattern, message)

  switch (message?.pattern) {
  case EVENTS.TASK_CREATED:
    return errorHandler(message, addTaskCostWorker)
  case EVENTS.TASK_ASSIGNED:
    return errorHandler(message, withdrawTransactionWorker)
  case EVENTS.USER_REGISTERED:
    return errorHandler(message, createBillWorker)
  case EVENTS.TASK_COMPLETED:
    return errorHandler(message, depositTransactionWorker)
  case EVENTS.DAILY_MONEY_CALCULATED:
    return errorHandler(message, sendMailWorker)
  default:
    throw new ValidationError(`Such a pattern does not exist. Received: ${message?.pattern ?? ''}`)
  }
}

(async () => {
  // Event subscriptions
  await subscribe(
    { exchangeName: EXCHANGES.BUSINESS_EVENTS, type: 'topic', },
    {
      queue: 'accounting', routingKeys: [
        'task.assigned',
        'task.cost.set',
        'withdraw.applied',
        'deposit.applied',
        'task.completed',
        'user.registered',
        'tasks.shuffled'
      ], options: {
        durable: true,
        ['x-dead-letter-exchange']: `${EXCHANGES.BUSINESS_EVENTS}.dlx`,
        ['x-dead-letter-routing-key']: 'accounting', },
    },
    simpleHandler,
    { noAck: false, }
  )

  await subscribe(
    { exchangeName: EXCHANGES.CUD_EVENTS, type: 'topic', },
    {
      queue: 'accounting', routingKeys: [
        'task.cost.set',
        'withdraw.applied',
        'deposit.applied',
        'task.created',
        'daily.money.calculated',
        'email.sent',
        'balance.cleared',
        'bill.created'
      ], options: {
        durable: true,
        ['x-dead-letter-exchange']: `${EXCHANGES.CUD_EVENTS}.dlx`,
        ['x-dead-letter-routing-key']: 'accounting', },
    },
    simpleHandler,
    { noAck: false, }
  )
})()
