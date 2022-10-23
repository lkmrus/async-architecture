import Fastify from 'fastify'
import fastifyCors from 'fastify-cors'
import { auth, logger, } from 'Utils'
import { constants, } from 'Config'
import TaskController from 'Modules/task/TaskController'
import '../rpc'

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
  },
  TaskController.createTask
)
app.patch(
  '/tasks/assign',
  { preHandler: [auth.authZ], },
  TaskController.assignTask
)
app.patch(
  '/tasks/complete',
  {
    preHandler: [auth.authZ],
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
