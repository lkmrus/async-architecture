export class ForbiddenError extends Error {
  constructor(messageError = '', errorCode = 403) {
    const message = messageError || 'Forbidden error.js'
    super(message)
    this.name = 'Forbidden_Error'
    this.statusCode = errorCode
  }
}
