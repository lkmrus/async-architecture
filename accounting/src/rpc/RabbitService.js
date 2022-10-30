import amqp from 'amqplib'
import { RABBIT_CONNECTION, } from 'Config/constants'
import logger from 'Utils/logger'
import { AppError, } from 'Exceptions'
const { serialize, deserialize, } = require('SchemaRegistryLib')

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
  await channel.assertExchange(exchangeName, type)
  // TODO add distributed log recording with transactions

  await channel.publish(exchangeName, routingKey, serialize({
    pattern: routingKey,
    data: object,
  }))
}

export const subscribe = async function (
  { exchangeName, type, exchangeOptions = { durable: true, }, },
  { queue , options = {}, routingKeys, },
  workerFn,
  consumeOptions = { noAck: false, }
) {
  await initChannel()
  await channel.assertExchange(exchangeName, type)
  if (options['x-dead-letter-exchange']) {
    await channel.assertExchange(options['x-dead-letter-exchange'], 'fanout', exchangeOptions)
  }
  const qok = await channel.assertQueue(queue, options)
  routingKeys.map(routingKey => channel.bindQueue(qok.queue, exchangeName, routingKey))

  await channel.consume(queue, async function (message) {
    try {
      await workerFn(deserialize(message.content))
      channel.ack(message)
    }
    catch (e) {
      logger.error(e)
      throw e
    }
  }, consumeOptions)

  return channel
}
