import { AuthService, } from 'Config/singletones'
import me from 'Helpers/me'
import { CLIENT_TYPES, ROLES, } from 'Config/constants'
import { ForbiddenError, } from 'Exceptions'
import * as validate from './utils/validation'

export default class AuthController extends AuthService {
  checkAdminRole(req, _res, next) {
    if (!req.user || req.user?.role !== ROLES.ADMIN) {
      throw new ForbiddenError()
    }
    return next()
  }

  async getContext(req, _res, next) {
    const { type = null, id = null, authenticated = null, } = await super.verify(req.headers?.authorization)
    if (type === CLIENT_TYPES.USER) {
      const user = await me(id)
      Object.assign(req, { user, })
    }
    // TODO add context for app type
    Object.assign(req, { type, id, authenticated, })

    return next()
  }

  signIn({ body, }) {
    validate.signIn(body)
    return super.signIn(body.login, body.password)
  }

  // TODO signOut() {}

  signUp({ body, }) {
    validate.signUp(body)
    return super.signUp(body)
  }
}
