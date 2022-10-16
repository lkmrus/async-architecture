import BillService from 'Modules/bill/BillService'
import { publish, } from './RabbitService'
import { EVENTS, EXCHANGES, } from './index'
import NotificationService from 'Modules/notifcation/NotificationService'
import MoneyService from 'Modules/money/MoneyService'

// TODO доработать и протестировать каждый метод

export const accrueMoneyWorker = async data => {
  if (data.message?.userId) {
    await MoneyService.accrueMoney(data.message.response.id)
    await publish(EXCHANGES.BUSINESS_EVENTS, EVENTS.MONEY_ACCRUED, {}, 'topic')
  }
}

export const createBillWorker = async data => {
  if (data.message) {
    await BillService.create(data.message.userId)
    await publish(EXCHANGES.CUD_EVENTS, EVENTS.BILL_CREATED, {}, 'topic')
  }
}

export const debitedMoneyWorker = async data => {
  if (data.message?.userId) {
    await MoneyService.debitedMoney(data.message.response.id)
    await publish(EXCHANGES.BUSINESS_EVENTS, EVENTS.MONEY_DEBITED, {}, 'topic')
  }
}

export const sendMailWorker = async data => {
  if (data.message) {
    await NotificationService.send(data.message.userId)
    await publish(EXCHANGES.CUD_EVENTS, EVENTS.EMAIL_SENT, {}, 'topic')
  }
}

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
