import amqp from 'amqplib'
import { RABBIT_CONNECTION, } from 'Config/constants'
import logger from 'Utils/logger'
import { AppError, } from 'Exceptions'

let connection = null
let channel = null

const getConnection = async () => {
  if (connection) {
    return connection
  }
  connection = await amqp.connect(RABBIT_CONNECTION, {
    keepAlive: true,
  }).catch(e => {
    logger.error(e)
    throw new AppError('Error connecting to rabbit')
  })
  return connection
}

const initChannel = async () => {
  return getConnection().then(async connection => {
    if (channel) {
      return channel
    }
    channel = await connection.createChannel()
    return channel
  }).catch(e => {
    logger.error(e)
    throw new AppError('Error get channel to rabbit')
  })
}

export const publish = async function (exchangeName, routingKey, object, type = 'topic') {
  if (!exchangeName) {
    throw new AppError('Publisher settings not declared')
  }
  await initChannel()
    .then(() => channel.assertExchange(exchangeName, type))
    .then(() => {
      // TODO add distraction log recording with transactions

      channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify({
        pattern: routingKey,
        message: object,
      })))
    })
}

export const subscribe = async function (
  { exchangeName, type, exchangeOptions = { durable: true, }, },
  { queue , options = {}, routingKey, },
  workerFn,
  consumeOptions = { noAck: false, }
) {
  await initChannel()

  return channel.assertExchange(exchangeName, type, exchangeOptions)
    .then(async () => {
      if (options['x-dead-letter-exchange']) {
        await channel.assertExchange(options['x-dead-letter-exchange'], 'fanout', exchangeOptions)
      }
      return channel.assertQueue(queue, options)
    })
    .then(qok => channel.bindQueue(qok.queue, exchangeName, routingKey)
    ).then(async () => {
      await channel.consume(queue, async function (message) {
        try {
          await workerFn(JSON.parse(message.content.toString()))
          channel.ack(message)
        }
        catch (e) {
          logger.error(e)
        }
      }, consumeOptions)
      return channel
    })
}
