import { isAccountant, } from 'Utils'

export default class AccountingController {
  static applyWithdrawTransaction(req) {

  }

  static applyDepositTransaction(req) {

  }

  static applyPaymentTransaction(req) {

  }

  static calculateAmountEarned(req) {

  }

  static getStatisticsByDays(req) {

  }

  static calculateAmountDayEarned({ user, params, body, }) {
    if (isAccountant(user)) {
      return
    }
    else {
      return
    }
  }

  static getAuditLog(req) {

  }

  static getCurrentBalance(req) {

  }
}
