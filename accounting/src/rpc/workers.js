import BillService from 'Modules/bill/BillService'
import NotificationService from 'Modules/notification/NotificationService'
import { checkSchema, } from 'SchemaRegistryLib'
import TransactionService from 'Modules/analytics/TransactionService'

// TODO доработать и протестировать каждый метод

export const withdrawTransactionWorker = async message => {
  checkSchema(message.pattern, message)
  const { publicId: taskPublicId, userId, } = message.data
  await TransactionService.applyWithdrawTransaction(userId, taskPublicId)
}

export const createBillWorker = async message => {
  checkSchema(message.pattern, message)
  await BillService.create(message.data.userId)
}

export const depositTransactionWorker = async message => {
  checkSchema(message.pattern, message)
  const { publicId: taskPublicId, userId, } = message.data
  await TransactionService.depositTransactionWorker(userId, taskPublicId)
}

export const sendMailWorker = async message => {
  checkSchema(message.pattern, message)
  await NotificationService.send(message.data.userId)
}

