import { ValidationError, } from 'Exceptions'

export const signIn = data => {
  if (!data.login) {
    throw new ValidationError('Login not specified')
  }
  if (!data.password) {
    throw new ValidationError('Password not specified')
  }
}

export const signUp = data => {
  signIn(data)
  if (!data.name) {
    throw new ValidationError('Name not specified')
  }
}
