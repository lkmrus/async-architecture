import { publish, } from '../../rpc/RabbitService'
import { EVENTS, EXCHANGES, } from '../../rpc'

export default class NotificationService {
  static async send(userId) {
    // TODO SEND MAIL

    await publish(EXCHANGES.CUD_EVENTS, EVENTS.EMAIL_SENT, { userId, }, 'topic')
  }
}
