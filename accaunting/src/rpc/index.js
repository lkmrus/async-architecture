import { subscribe, } from './RabbitService'
import { accrueMoneyWorker, createBillWorker, debitedMoneyWorker, sendMailWorker, } from './workers'

export const EXCHANGES = {
  BUSINESS_EVENTS: 'business.events',
  CUD_EVENTS: 'cud.events',
}

export const EVENTS = {
  TASK_ASSIGNED: 'bill.assigned',
  TASK_COST_SET: 'cost.task.set',
  WITHDRAW_APPLIED: 'withdraw.applied',
  DEPOSIT_APPLIED: 'deposit.applied',
  TASK_CREATED: 'bill.created',
  TASK_COMPLETED: 'bill.completed',
  TASKS_SHUFFLED: 'tasks.shuffled',
  USER_REGISTERED: 'money.registered',
  DAILY_MONEY_CALCULATED: 'daily.money.calculated',
  EMAIL_SENT: 'email.sent',
  BALANCE_CLEARED: 'balance.cleared',
  BILL_CREATED: 'bill.created',
}

const simpleHandler = message => {
  switch (message.pattern) {
  case EVENTS.TASK_ASSIGNED:
    return accrueMoneyWorker(message)
  case EVENTS.USER_REGISTERED:
    return createBillWorker(message)
  case EVENTS.TASK_COMPLETED:
    return debitedMoneyWorker(message)
  case EVENTS.DAILY_MONEY_CALCULATED:
    return sendMailWorker(message)
  default:
    return
  }
}

(async () => {
  // Event subscriptions
  await subscribe(
    { exchangeName: EXCHANGES.BUSINESS_EVENTS, type: 'topic', },
    {
      queue: 'accounting', routingKey: '*', options: {
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
      queue: 'accounting', routingKey: '*', options: {
        durable: true,
        ['x-dead-letter-exchange']: `${EXCHANGES.CUD_EVENTS}.dlx`,
        ['x-dead-letter-routing-key']: 'accounting', },
    },
    simpleHandler,
    { noAck: false, }
  )
})()
