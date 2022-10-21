import Fastify from 'fastify'
import fastifyCors from 'fastify-cors'
import { auth, authZ, authN, logger, } from 'Utils'
import { constants, } from 'Config'
import { publish, } from '../rpc/RabbitService'

const fastifyOptions = {}
if (constants.NODE_ENV !== 'production') {
  fastifyOptions.logger = logger
}

const responsePublish = (exchange, routingKey, additionalData = {}) => {
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

const app = Fastify(fastifyOptions)
app.register(fastifyCors)

// TODO Add api to accounting and analytics domains
// ROLE Accountant: GET /accounting/amount-earned-calculate
// ROLE Accountant: GET /accounting/statistics-by-days
// ROLE Accountant: GET /accounting/amount-day-earned-calculate
//
// ROLE User: GET /accounting/audit-log
// ROLE User: GET /accounting/current-balance
// ROLE User: GET /accounting/:userId/amount-day-earned
//
// ROLE Admin: GET /analytics/negative-balance-users
// ROLE Admin: GET /analytics/amount-day-earned-calculate

// TODO Add 2 cron events

app.setNotFoundHandler((req, res) => {
  res.status(404).send({ message: 'The route does not exist', })
})

app.setErrorHandler((error, request, reply) => {
  reply.status(error.statusCode || 500).send(error)
})

export default app
