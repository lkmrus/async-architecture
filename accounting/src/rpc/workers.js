import BillService from 'Modules/bill/BillService'
import NotificationService from 'Modules/notification/NotificationService'
import { checkSchema, } from 'SchemaRegistryLib'
import TransactionService from 'Modules/analytics/TransactionService'
import TaskService from 'Modules/task/TaskService'

// TODO доработать и протестировать каждый метод

export const addTaskCostWorker = async message => {
  checkSchema(message.pattern, message)
  const { publicId, } = message.data
  await TaskService.setTaskCost(publicId)
}

export const withdrawTransactionWorker = async message => {
  checkSchema(message.pattern, message)
  const { publicId, userId, } = message.data
  await TransactionService.applyWithdrawTransaction(userId, publicId)
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

