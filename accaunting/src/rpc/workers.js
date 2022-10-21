import BillService from 'Modules/bill/BillService'
import { publish, } from './RabbitService'
import { EVENTS, EXCHANGES, } from './index'
import NotificationService from 'Modules/notification/NotificationService'
import MoneyService from 'Modules/accounting/AccountingService'
import { validate, } from 'SchemaRegistryLib'

// TODO доработать и протестировать каждый метод

export const withdrawTransactionWorker = async message => {
  validate(message.pattern, message)

  await MoneyService.accrueMoney(message.data.response.id)
  await publish(EXCHANGES.BUSINESS_EVENTS, EVENTS.WITHDRAW_APPLIED, {}, 'topic')
}

export const createBillWorker = async message => {
  validate(message.pattern, message)

  await BillService.create(message.data.userId)
  await publish(EXCHANGES.CUD_EVENTS, EVENTS.BILL_CREATED, {}, 'topic')

}

export const depositTransactionWorker = async message => {
  validate(message.pattern, message)

  await MoneyService.debitedMoney(message.data.response.id)
  await publish(EXCHANGES.BUSINESS_EVENTS, EVENTS.DEPOSIT_APPLIED, {}, 'topic')

}

export const sendMailWorker = async message => {
  validate(message.pattern, message)

  await NotificationService.send(message.data.userId)
  await publish(EXCHANGES.CUD_EVENTS, EVENTS.EMAIL_SENT, {}, 'topic')

}

