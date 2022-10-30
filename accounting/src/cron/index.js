import { publish, } from '../rpc/RabbitService'
import { EVENTS, EXCHANGES, } from '../rpc'

// TODO daily night cron
export const clearBalance = async () => {
  // TODO Выплатить сотрудникам
  // TODO обнулить баланс
  await publish(EXCHANGES.BUSINESS_EVENTS, EVENTS.BALANCE_CLEARED, {}, 'topic')
}

// TODO daily cron
export const userEarned = async () => {
  const data = []
  // TODO посчитать сколько заработал за день

  await Promise.all(
    data.map(({ userId, earned, }) => publish(EXCHANGES.BUSINESS_EVENTS, EVENTS.DAILY_MONEY_CALCULATED, { userId, earned, }, 'topic'))
  )
}
