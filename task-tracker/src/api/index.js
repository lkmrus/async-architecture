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
  return async (req, reply, payload) => {
    const response = JSON.parse(payload)
    if (response?.error) {
      return
    }
    const data = {
      ...additionalData,
      userId: req?.user?.id,
      taskId: response?.id,
      publicId: response?.publicId,
      request: req.body,
      response,
      date: new Date(),
    }
    console.log(data)
    await publish(exchange, routingKey, data)
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
    // TODO Создавать транзакцию для возможности отмены сохранения если событие не отправится
    // TODO перенести отправку события в сервис
    onSend: [responsePublish(EXCHANGES.CUD_EVENTS, EVENTS.TASK_CREATED)],
  },
  TaskController.createTask
)
app.patch(
  '/tasks/assign',
  {
    preHandler: [auth.authZ],
    // TODO Создавать транзакцию для возможности отмены сохранения если событие не отправится
    // TODO перенести отправку события в сервис
    onSend: [responsePublish(EXCHANGES.BUSINESS_EVENTS, EVENTS.TASK_ASSIGNED)],
  },
  TaskController.assignTask
)
app.patch(
  '/tasks/complete',
  {
    preHandler: [auth.authZ],
    // TODO Создавать транзакцию для возможности отмены сохранения если событие не отправится
    // TODO перенести отправку события в сервис
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
