export class AppError extends Error {
  constructor(messageError = '', errorCode = 502) {
    const message = messageError || 'Application error.js'
    super(message)
    this.name = 'App_Error'
    this.statusCode = errorCode
  }
}
