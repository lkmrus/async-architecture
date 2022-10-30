import BillService from 'Modules/bill/BillService'
import NotificationService from 'Modules/notification/NotificationService'
import TransactionService from 'Modules/analytics/TransactionService'
import TaskService from 'Modules/task/TaskService'

// TODO доработать и протестировать каждый метод

export const addTaskCostWorker = async message => {
  const { publicId, } = message.data
  await TaskService.setTaskCost(publicId)
}

export const withdrawTransactionWorker = async message => {
  const { publicId, userId, } = message.data
  await TransactionService.applyWithdrawTransaction(userId, publicId)
}

export const createBillWorker = async message => {
  await BillService.create(message.data.userId)
}

export const depositTransactionWorker = async message => {
  const { publicId: taskPublicId, userId, } = message.data
  await TransactionService.depositTransactionWorker(userId, taskPublicId)
}

export const sendMailWorker = async message => {
  await NotificationService.send(message.data.userId)
}

