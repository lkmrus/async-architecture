import { checkHash, makeHash, } from 'Utils/makeHash'
import { db, constants, } from 'Config'
import { issueJWT, pluckAuthToken, verifyJWT, } from './utils/authentication'
import { AuthError, } from 'Exceptions'

export default class AuthService {
  static async verify(token) {
    const jwtToken = pluckAuthToken(token)
    if (!jwtToken) {
      return {
        id: -1,
        authenticated: false,
        type: constants.CLIENT_TYPES.GUEST,
      }
    }

    const payload = await verifyJWT(jwtToken)
    if (payload.appId) {
      return {
        id: payload.appId,
        authenticated: true,
        type: constants.CLIENT_TYPES.APP,
      }
    }
    if (payload.id) {
      return {
        id: payload.id,
        authenticated: true,
        type: constants.CLIENT_TYPES.USER,
      }
    }
    return {}
  }

  static async signIn(login, password) {
    const hash = await makeHash(password)

    const user = await db.user.findOne({ where: { login, }, })
    if (!user) {
      throw new AuthError('Please check your login')
    }

    const isValid = await checkHash(hash, password)
    if (!isValid) {
      throw new AuthError('Please check your password')
    }
    return issueJWT()({
      id: user.id,
    })
  }

  static async signUp(data) {
    data.password = await makeHash(data.password)
    return db.user.create(data)
      // TODO refactor
      .then(data => {
        delete data.dataValues?.password
        return data
      })
  }
}
