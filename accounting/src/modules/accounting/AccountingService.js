import { db, } from 'Config'

export default class AccountingService {
  static getEarnedByToday(filter = {}, sort = [['date', 'DESC']], limit, offset) {
    const dayFromNow = new Date(new Date().setDate(new Date().getDate() + 7))

    return db.transaction.findAll({
      where: {
        ...filter, date: {
          $gt: new Date(),
          $lt: dayFromNow,
        },
      },
      sort,
      limit, offset,
    })
  }

  static async getAmountEarned(filter = {}, sort = [['date', 'DESC']], limit, offset) {
    return db.transaction.findAll({
      where: filter,
      sort,
      limit,
      offset,
    })
  }

  static async getBalance(userId) {
    return db.bill.findOne({ where: { userId, }, })
      .then(response => response.balance)
  }
}
