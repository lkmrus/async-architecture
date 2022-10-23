import Fastify from 'fastify'
import fastifyCors from 'fastify-cors'
import { authZ, isAccountant, isAdmin, logger, } from 'Utils'
import { constants, } from 'Config'
import AccountingController from 'Modules/accounting/AccountingController'
import AnalyticsController from 'Modules/analytics/AnalyticsController'
import '../rpc'

const fastifyOptions = {}
if (constants.NODE_ENV !== 'production') {
  fastifyOptions.logger = logger
}

const app = Fastify(fastifyOptions)
app.register(fastifyCors)

app.get(
  '/accounting/amount-earned-calculate',
  { preHandler: [authZ, req => isAccountant(req.user, false)], },
  AccountingController.calculateAmountEarned
)
app.get(
  '/accounting/statistics-by-days',
  { preHandler: [authZ, req => isAccountant(req.user, false)], },
  AccountingController.getStatisticsByDays
)
app.get(
  '/accounting/amount-day-earned-calculate',
  { preHandler: [authZ, req => isAccountant(req.user, false)], },
  AccountingController.calculateAmountDayEarned
)

app.get('/accounting/audit-log', { preHandler: [authZ], }, AccountingController.getAuditLog)
app.get('/accounting/current-balance', { preHandler: [authZ], },AccountingController.getCurrentBalance)
app.get('/accounting/:userId/amount-day-earned', { preHandler: [authZ], }, AccountingController.calculateAmountDayEarned)

app.get(
  '/analytics/negative-balance-users',
  { preHandler: [authZ, req => isAdmin(req.user, false)], },
  AnalyticsController.getNegativeUserBalance
)
app.get(
  '/analytics/amount-day-earned-calculate',
  { preHandler: [authZ, req => isAdmin(req.user, false)], },
  AnalyticsController.calculateAmountDayEarned
)

// TODO Add 2 cron events

app.setNotFoundHandler((req, res) => {
  res.status(404).send({ message: 'The route does not exist', })
})

app.setErrorHandler((error, request, reply) => {
  reply.status(error.statusCode || 500).send(error)
})

export default app
