export class AuthError extends Error {
  constructor(messageError = '', errorCode = 401) {
    const message = messageError || 'You are not an authorized money.'
    super(message)
    this.name = 'Auth_Error'
    this.statusCode = errorCode
  }
}
