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
  return async (_req, reply, payload, done) => {
    await publish(exchange, routingKey, {
      ...additionalData,
      userId: reply.request.user?.id,
      request: reply.request.body,
      response: payload,
      date: new Date(),
    })
    done()
  }
}

const app = Fastify(fastifyOptions)
app.register(fastifyCors)

app.get('/users', { preHandler: [AuthController.getContext, AuthController.checkAdminRole], }, UserController.getUsers)
app.post('/users/change_password', { preHandler: [AuthController.getContext], }, UserController.changePassword)
app.post('/users/change_profile/:id', { onResponse: [], }, UserController.changeProfile)

app.post('/roles/assign_role/:id', { preHandler: [AuthController.getContext, AuthController.checkAdminRole], }, RoleController.assignRole)

app.get('/auth/check', { preHandler: [AuthController.getContext], }, AuthController.checkUser)
app.post('/auth/sign_in', AuthController.signIn)
app.post('/auth/sign_up',{
  onSend: [responsePublish(EXCHANGES.BUSINESS_EVENTS, EVENTS.USER_REGISTERED)],
}, AuthController.signUp)

app.setNotFoundHandler((req, res) => {
  res.status(404).send({ message: 'The route does not exist.', })
})

app.setErrorHandler((error, request, reply) => {
  reply.status(error.statusCode || 500).send(error)
})

export default app
