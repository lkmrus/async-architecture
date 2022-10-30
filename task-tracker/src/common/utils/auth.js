import { ROLES, SERVICES, } from 'Config/constants'
import axios from 'axios'
import { AppError, AuthError, } from 'Exceptions'

export const authN = async req => {
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

export const isAdmin = user => {
  return user?.role === ROLES.ADMIN
}

export const isManager = user => {
  return user?.role === ROLES.MANAGER
}
