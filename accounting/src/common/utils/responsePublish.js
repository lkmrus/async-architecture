import { publish, } from '../../rpc/RabbitService'

export const responsePublish = (exchange, routingKey, additionalData = {}) => {
  return async (req, reply, payload) => {
    const response = JSON.parse(payload)
    if (response?.error) {
      return
    }

    await publish(exchange, routingKey, {
      ...additionalData,
      userId: reply.request?.user?.id,
      request: reply.request.body,
      response,
      date: new Date(),
    })
  }
}
