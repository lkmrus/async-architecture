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
    onResponse: [(request, reply) => publish(EXCHANGES.CUD_EVENTS, EVENTS.TASK_CREATED, { data: reply.request.body, userId: reply.request.user?.id, })],
  },
  TaskController.createTask
)
app.patch(
  '/tasks/assign',
  {
    preHandler: [auth.authZ], onResponse: [ (req, reply) => {
      publish(EXCHANGES.BUSINESS_EVENTS, EVENTS.TASK_ASSIGNED, {
        data: reply.request.body,
        userId: reply.request.user?.id,
      })
    }],
  },
  TaskController.assignTask
)
app.patch(
  '/tasks/complete',
  {
    preHandler: [auth.authZ],
    onResponse: [(req, reply) => publish(EXCHANGES.BUSINESS_EVENTS, EVENTS.TASK_COMPLETED, { data: reply.request.body,
      userId: reply.request.user?.id, })],
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
