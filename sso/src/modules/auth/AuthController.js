import AuthService from './AuthService'
import me from 'Helpers/me'
import { CLIENT_TYPES, ROLES, } from 'Config/constants'
import { ForbiddenError, } from 'Exceptions'
import * as validate from './utils/validation'
import { isObject, } from 'lodash'

export default class AuthController {
  static checkAdminRole(req, reply, done) {
    if (!req.user || req.user?.role !== ROLES.ADMIN) {
      throw new ForbiddenError()
    }
    done()
  }

  static async getContext(req, reply, done) {
    const { type = null, id = null, authenticated = null, } = await AuthService.verify(req.headers?.authorization)
    if (type === CLIENT_TYPES.USER) {
      const user = await me(id)
      Object.assign(req, { user, })
    }
    // TODO add context for app type
    Object.assign(req, { type, id, authenticated, })
    done()
  }

  static signIn({ body, }) {
    validate.signIn(body)
    return AuthService.signIn(body.login, body.password)
  }

  // TODO signOut() {}

  static signUp({ body, }) {
    validate.signUp(body)
    return AuthService.signUp(body)
  }

  static checkUser({ user, }) {
    if (!isObject(user) || !Object.keys(user).length) {
      return null
    }
    return user
  }
}
