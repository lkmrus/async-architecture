import Fastify from 'fastify'
import fastifyCors from 'fastify-cors'
import { logger, } from 'Utils'
import { constants, } from 'Config'
import AuthController from 'Modules/auth/AuthController'
import { UserController, } from 'Modules/user/UserController'
import { RoleController, } from 'Modules/role/RoleController'

const fastifyOptions = {}
if (constants.NODE_ENV !== 'production') {
  fastifyOptions.logger = logger
}
const app = Fastify(fastifyOptions)
app.register(fastifyCors)

const auth = new AuthController()
const role = new RoleController()
const user = new UserController()

app.get('/users', { preHandler: [auth.getContext, auth.checkAdminRole], }, user.getUsers)
app.post('/users/change_password', { preHandler: [auth.getContext], }, user.changePassword)
app.post('/users/change_profile/:id', user.changeProfile)

app.post('/roles/assign_role/:id', { preHandler: [auth.getContext, auth.checkAdminRole], }, role.assignRole)

app.post('/auth/sign_in', auth.signIn)
app.post('/auth/sign_up', auth.signUp)

app.setNotFoundHandler((req, res) => {
  res.status(404).send({ message: 'The route does not exist.', })
})

app.setErrorHandler((error, request, reply) => {
  reply.status(error.statusCode || 500).send(error)
})

export default app
