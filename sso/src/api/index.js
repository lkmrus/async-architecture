import Fastify from 'fastify'
import fastifyCors from 'fastify-cors'
import { logger, } from 'Utils'
import { constants, } from 'Config'
import AuthController from 'Modules/auth/AuthController'
import UserController from 'Modules/user/UserController'
import RoleController from 'Modules/role/RoleController'
import { EVENTS, EXCHANGES, } from '../rpc'
import { publish, } from '../rpc/RabbitService'

const fastifyOptions = {}
if (constants.NODE_ENV !== 'production') {
  fastifyOptions.logger = logger
}

const responsePublish = (exchange, routingKey, additionalData = {}) => {
  return async (_req, reply, payload) => {
    const response = JSON.parse(payload)
    if (response?.error) {
      return
    }

    const userId = !reply.request.user ? response?.id : reply.request.user?.id
    const publicId = !reply.request.user ? response?.publicId : reply.request.user?.publicId
    await publish(exchange, routingKey, {
      ...additionalData,
      userId,
      publicId,
      request: reply.request?.body,
      response,
      date: new Date(),
    })
  }
}

const app = Fastify(fastifyOptions)
app.register(fastifyCors)

app.get('/users',
  { preHandler: [AuthController.getContext, AuthController.checkAdminRole], },
  UserController.getUsers)
app.post('/users/change_password', {
  preHandler: [AuthController.getContext],
  // TODO перенести отправку события в сервис
  onSend: [responsePublish(EXCHANGES.BUSINESS_EVENTS, EVENTS.PASSWORD_CHANGED)],
}, UserController.changePassword)
app.post('/users/change_profile/:id', UserController.changeProfile)

app.post('/roles/assign_role/:id', {
  preHandler: [AuthController.getContext,
    AuthController.checkAdminRole],
}, RoleController.assignRole)

app.get('/auth/check', { preHandler: [AuthController.getContext], }, AuthController.checkUser)
app.post('/auth/sign_in', AuthController.signIn)
app.post('/auth/sign_up',{
  // TODO перенести отправку события в сервис
  onSend: [responsePublish(EXCHANGES.CUD_EVENTS, EVENTS.USER_REGISTERED)],
}, AuthController.signUp)

app.setNotFoundHandler((req, res) => {
  res.status(404).send({ message: 'The route does not exist.', })
})

app.setErrorHandler((error, request, reply) => {
  reply.status(error.statusCode || 500).send(error)
})

export default app
