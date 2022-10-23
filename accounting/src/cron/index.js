import { publish, } from '../rpc/RabbitService'
import { EVENTS, EXCHANGES, } from '../rpc'

// TODO daily night cron
export const clearBalance = async () => {
  // TODO обнулить баланс в полночь
  await publish(EXCHANGES.BUSINESS_EVENTS, EVENTS.BALANCE_CLEARED, {}, 'topic')
}

// TODO daily cron
export const userEarned = async () => {
  // TODO посчитать сколько заработал за день
  await publish(EXCHANGES.BUSINESS_EVENTS, EVENTS.DAILY_MONEY_CALCULATED, {}, 'topic')
}
