import { publish, } from '../../rpc/RabbitService'
import { EVENTS, EXCHANGES, } from '../../rpc'

export default class TransactionService {
  static async applyWithdrawTransaction(userId, taskPublicId) {
    console.log('WITHDRAW TRANSACTION', userId, taskPublicId) // TODO add logic
    await publish(EXCHANGES.BUSINESS_EVENTS, EVENTS.WITHDRAW_APPLIED, { taskPublicId, userId, }, 'topic')
  }

  static async depositTransactionWorker(userId, taskPublicId) {
    console.log('DEPOSIT TRANSACTION', userId, taskPublicId) // TODO add logic

    await publish(EXCHANGES.BUSINESS_EVENTS, EVENTS.DEPOSIT_APPLIED, { taskPublicId, userId, }, 'topic')
  }
}
