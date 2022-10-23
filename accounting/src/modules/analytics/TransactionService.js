import { publish, } from '../../rpc/RabbitService'
import { EVENTS, EXCHANGES, } from '../../rpc'
import { db, } from 'Config'
import { math, } from 'Utils'


export default class TransactionService {
  static async applyWithdrawTransaction(userId, taskPublicId) {
    const t = await db.sequelize.transaction()
    try {
      const value = math.randomIncrement(-20, -10)
      const [[[response]]] = await db.bill.increment({ balance: value, }, { where: { userId, }, })
      await db.transaction.create({ taskId: taskPublicId, bill: response.bill, credit: +value, deposit: 0, userId, })
      await publish(EXCHANGES.BUSINESS_EVENTS, EVENTS.WITHDRAW_APPLIED, { taskPublicId, userId, }, 'topic')
    }
    catch (e) {
      await t.rollback()
    }
  }

  static async depositTransactionWorker(userId, taskPublicId) {
    const t = await db.sequelize.transaction()
    try {
      const data = await db.task.findOne({ where: {
        taskId: taskPublicId,
      }, })
      const [[[response]]] = await db.bill.increment({ balance: +data.dataValues.cost || 0, }, { where: { userId, }, })
      await db.transaction.create({ taskId: taskPublicId.toString(), bill: response.bill, credit: 0, deposit: +data.dataValues.cost, userId, })

      await publish(EXCHANGES.BUSINESS_EVENTS, EVENTS.DEPOSIT_APPLIED, { taskPublicId, userId, }, 'topic')
    }
    catch (e) {
      await t.rollback()
    }
  }
}
