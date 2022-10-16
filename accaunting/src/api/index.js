import Fastify from 'fastify'
import fastifyCors from 'fastify-cors'
import { auth, logger, } from 'Utils'
import { constants, } from 'Config'
import { publish, } from '../rpc/RabbitService'

const fastifyOptions = {}
if (constants.NODE_ENV !== 'production') {
  fastifyOptions.logger = logger
}

const responsePublish = (exchange, routingKey, additionalData = {}) => {
  return async (req, reply, payload) => {
    await publish(exchange, routingKey, {
      ...additionalData,
      userId: reply.request?.user?.id,
      request: reply.request.body,
      response: JSON.parse(payload),
      date: new Date(),
    })
  }
}

const app = Fastify(fastifyOptions)
app.register(fastifyCors)

// TODO Add api to accounting and analytics domains
// ROLE Accountant: GET /accaunting/amount-earned-calculate
// ROLE Accountant: GET /accaunting/statistics-by-days
// ROLE Accountant: GET /accaunting/amount-day-earned-calculate
//
// ROLE User: GET /accaunting/money-log
// ROLE User: GET /accaunting/current-balance
// ROLE User: GET /accaunting/:userId/amount-day-earned
//
// ROLE Admin: GET /analitics/negative-balance-users
// ROLE Admin: GET /analitics/amount-day-earned-calculate

// TODO Add 2 cron events

app.setNotFoundHandler((req, res) => {
  res.status(404).send({ message: 'The route does not exist', })
})

app.setErrorHandler((error, request, reply) => {
  reply.status(error.statusCode || 500).send(error)
})

export default app
