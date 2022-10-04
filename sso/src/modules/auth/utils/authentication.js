import { createSigner, createVerifier, } from 'fast-jwt'
import { AuthError, } from 'Exceptions'

// TODO change vars to env vars

export const pluckAuthToken = authString => {
  // If nothing provided.
  if (!authString) {
    return
  }

  const matches = authString.match(/(?:token|bearer)\s+(.*)/i)

  if (matches) {
    return matches[1]
  }
}

const mainJWTVerifier = createVerifier({
  key: 'some_secret',
  // Specify algorithms explicitly, to avoid 'none attack'.
  algorithms: ['HS256'],
  cache: 1000,
})

export const verifyJWT = async token => {
  try {
    return await mainJWTVerifier(token)
  }
  catch (e) {
    e.message = 'Session expired, please try again'
    throw new AuthError()
  }
}

const day = 1000 * 60 * 60 * 24
export const issueJWT = (isPerpetualToken = false) => createSigner({
  key: 'some_secret',
  algorithm: 'HS256',
  expiresIn: isPerpetualToken ? null : day,
})
