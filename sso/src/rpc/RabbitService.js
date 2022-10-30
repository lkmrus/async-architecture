import amqp from 'amqplib'
import { RABBIT_CONNECTION, } from 'Config/constants'
import logger from 'Utils/logger'
import { AppError, } from 'Exceptions'
const { serialize, } = require('SchemaRegistryLib')

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
