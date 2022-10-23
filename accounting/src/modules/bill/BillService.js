import { db, } from 'Config'
import { publish, } from '../../rpc/RabbitService'
import { EVENTS, EXCHANGES, } from '../../rpc'

export default class BillService {
  static create(userId) {
    return db.bill.findOrCreate({ where: { userId, }, defaults: { userId, }, })
      .then(async ([bill]) => {
        await publish(EXCHANGES.CUD_EVENTS, EVENTS.BILL_CREATED, { userId, bill: bill.dataValues.bill, response: bill.dataValues, }, 'topic')
        return bill
      })
  }
}
