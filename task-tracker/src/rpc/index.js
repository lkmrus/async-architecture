import { subscribe, } from './RabbitService'
import { workerTaskShuffle, } from './workers'

export const EXCHANGES = {
  BUSINESS_EVENTS: 'business.events',
  CUD_EVENTS: 'cud.events',
}

export const EVENTS = {
  TASK_ASSIGNED: 'task.assigned',
  TASK_CREATED: 'task.created',
  TASK_COMPLETED: 'task.completed',
  TASKS_SHUFFLED: 'tasks.shuffled',
}

export const QUEUES = {
  TASK_TRACKER: 'task-tracker',
};

(async () => {
  const exchangeName = EXCHANGES.BUSINESS_EVENTS
  const queueName = QUEUES.TASK_TRACKER

  // Event subscriptions
  await subscribe(
    { exchangeName, type: 'topic', },
    {
      queue: queueName, routingKey: EVENTS.TASK_ASSIGNED, options: {
        durable: true,
        ['x-dead-letter-exchange']: `${exchangeName}.dlx`,
        ['x-dead-letter-routing-key']: queueName, },
    },
    workerTaskShuffle,
    { noAck: false, }
  )
})()
