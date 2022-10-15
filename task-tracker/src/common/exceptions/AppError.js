export class AppError extends Error {
  constructor(messageError = '', errorCode = 503) {
    const message = messageError || 'Application error'
    super(message)
    this.name = 'App_Error'
    this.statusCode = errorCode
  }
}
