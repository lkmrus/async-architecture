export class ValidationError extends Error {
  constructor(messageError = '', errorCode = 422) {
    const message = messageError || 'Validation error.js'
    super(message)
    this.name = 'Validation_Error'
    this.statusCode = errorCode
  }
}
