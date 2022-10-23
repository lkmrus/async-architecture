import { ROLES, SERVICES, } from 'Config/constants'
import axios from 'axios'
import { AppError, AuthError, ForbiddenError, } from 'Exceptions'

export const authZ = async req => {
  const url = new URL('auth/check', SERVICES.AUTH_URL).href
  req.user = await axios.get(url, { headers: req.headers, })
    .then(response => response.data)
    .catch(err => {
      if (!err.response) {
        throw new AppError(err.message.match('ECONNREFUSED') ? 'Auth service unavailable' : err.message, 503)
      }
      if (err.response.status > 299) {
        throw new AuthError(err.response.message, err.response.status)
      }
    })
}

export const isAdmin = (user, soft = true) => {
  const result = user?.role === ROLES.ADMIN
  if (!soft && !result) {
    throw new ForbiddenError('You don\'t have admin rights')
  }
  return result
}

export const isManager = (user, soft = true) => {
  const result = user?.role === ROLES.MANAGER || isAdmin(user, true)
  if (!soft && !result) {
    throw new ForbiddenError('You don\'t have manager rights')
  }
  return result
}

export const isAccountant = (user, soft = true) => {
  const result = user?.role === ROLES.ACCOUNTANT || isAdmin(user, true)
  if (!soft && !result) {
    throw new ForbiddenError('You don\'t have accountant rights')
  }
  return result
}
