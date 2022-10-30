import { isAccountant, } from 'Utils'
import AccountingService from 'Modules/accounting/AccountingService'

// TODO

export default class AccountingController {
  static async calculateAmountEarned({ query, params, }) {
    await AccountingService.getAmountEarned({ userId: params.id, ...query.filter, })
  }

  static getStatisticsByDays({ user, params, query, }) {
    return AccountingService.getAmountEarned({ ...query.filter, }, query.sort, query.limit, query.offset)
  }

  static calculateAmountDayEarned({ user, params, query, }) {
    if (isAccountant(user)) {
      return AccountingService.getAmountEarned({ ...query.filter, }, query.sort, query.limit, query.offset)
    }
    else {
      return AccountingService.getEarnedByToday({ userId: params.id, ...query.filter, }, query.sort, query.limit, query.offset)
    }
  }

  static getAuditLog(req) {
  //  TODO
  }

  static getCurrentBalance(req) {
    return AccountingService.getBalance(req.params.userId)
  }
}
