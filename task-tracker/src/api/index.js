import Fastify from 'fastify'
import fastifyCors from 'fastify-cors'
import { auth, logger, } from 'Utils'
import { constants, } from 'Config'
import TaskController from 'Modules/task/TaskController'
import { publish, } from '../rpc/RabbitService'
import { EVENTS, EXCHANGES, } from '../rpc'

const fastifyOptions = {}
if (constants.NODE_ENV !== 'production') {
  fastifyOptions.logger = logger
}

const responsePublish = (exchange, routingKey, additionalData = {}) => {
  return async (_req, reply, payload, done) => {
    await publish(exchange, routingKey, {
      ...additionalData,
      userId: reply.request?.user?.id,
      request: reply.request.body,
      response: payload,
      date: new Date(),
    })
    done()
  }
}

const app = Fastify(fastifyOptions)
app.register(fastifyCors)

app.get(
  '/tasks',
  { preHandler: [auth.authZ], },
  TaskController.getTasks
)
app.post(
  '/tasks',
  {
    preHandler: [auth.authZ],
    onSend: [responsePublish(EXCHANGES.CUD_EVENTS, EVENTS.TASK_CREATED)],
  },
  TaskController.createTask
)
app.patch(
  '/tasks/assign',
  {
    preHandler: [auth.authZ],
    // onSend: [ responsePublish(EXCHANGES.BUSINESS_EVENTS, EVENTS.TASK_ASSIGNED)],
  },
  TaskController.assignTask
)
app.patch(
  '/tasks/complete',
  {
    preHandler: [auth.authZ],
    onSend: [responsePublish(EXCHANGES.BUSINESS_EVENTS, EVENTS.TASK_COMPLETED)],
  },
  TaskController.completeTask
)

app.setNotFoundHandler((req, res) => {
  res.status(404).send({ message: 'The route does not exist', })
})

app.setErrorHandler((error, request, reply) => {
  reply.status(error.statusCode || 500).send(error)
})

export default app
