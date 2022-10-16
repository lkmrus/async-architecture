import { subscribe, } from './RabbitService'
import { accrueMoneyWorker, createBillWorker, debitedMoneyWorker, sendMailWorker, } from './workers'

export const EXCHANGES = {
  BUSINESS_EVENTS: 'business.events',
  CUD_EVENTS: 'cud.events',
}

export const EVENTS = {
  TASK_ASSIGNED: 'bill.assigned',
  TASK_COST_SET: 'cost.task.set',
  MONEY_ACCRUED: 'money.accrued',
  MONEY_DEBITED: 'money.debited',
  TASK_CREATED: 'bill.created',
  TASK_COMPLETED: 'bill.completed',
  TASKS_SHUFFLED: 'tasks.shuffled',
  USER_REGISTERED: 'money.registered',
  DAILY_MONEY_CALCULATED: 'daily.money.calculated',
  EMAIL_SENT: 'email.sent',
  BALANCE_CLEARED: 'balance.cleared',
  BILL_CREATED: 'bill.created',
};

(async () => {
  // Event subscriptions
  await subscribe(
    { exchangeName: EXCHANGES.BUSINESS_EVENTS, type: 'topic', },
    {
      queue: 'accounting', routingKey: EVENTS.TASK_ASSIGNED, options: {
        durable: true,
        ['x-dead-letter-exchange']: `${EXCHANGES.BUSINESS_EVENTS}.dlx`,
        ['x-dead-letter-routing-key']: 'accounting', },
    },
    accrueMoneyWorker,
    { noAck: false, }
  )

  await subscribe(
    { exchangeName: EXCHANGES.CUD_EVENTS, type: 'topic', },
    {
      queue: 'accounting', routingKey: EVENTS.USER_REGISTERED, options: {
        durable: true,
        ['x-dead-letter-exchange']: `${EXCHANGES.CUD_EVENTS}.dlx`,
        ['x-dead-letter-routing-key']: 'accounting', },
    },
    createBillWorker,
    { noAck: false, }
  )

  await subscribe(
    { exchangeName: EXCHANGES.BUSINESS_EVENTS, type: 'topic', },
    {
      queue: 'accounting', routingKey: EVENTS.TASK_COMPLETED, options: {
        durable: true,
        ['x-dead-letter-exchange']: `${EXCHANGES.BUSINESS_EVENTS}.dlx`,
        ['x-dead-letter-routing-key']: 'accounting', },
    },
    debitedMoneyWorker,
    { noAck: false, }
  )

  await subscribe(
    { exchangeName: EXCHANGES.BUSINESS_EVENTS, type: 'topic', },
    {
      queue: 'accounting', routingKey: EVENTS.DAILY_MONEY_CALCULATED, options: {
        durable: true,
        ['x-dead-letter-exchange']: `${EXCHANGES.BUSINESS_EVENTS}.dlx`,
        ['x-dead-letter-routing-key']: 'accounting', },
    },
    sendMailWorker,
    { noAck: false, }
  )
})()
