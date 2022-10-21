import { subscribe, } from './RabbitService'
import { workerCreateUser, workerTaskShuffle, } from './workers'

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

const simpleHandler = message => {
  switch (message.pattern) {
  case EVENTS.TASK_ASSIGNED:
    return workerTaskShuffle(message)
  case EVENTS.USER_REGISTERED:
    return workerCreateUser(message)
  default:
    return
  }
}

(async () => {
  // Event subscriptions
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
