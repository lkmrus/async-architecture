export class NotFoundError extends Error {
  constructor(messageError = '', errorCode = 404) {
    const message = messageError || 'Not Found Error'
    super(message)
    this.name = 'Not_Found_Error'
    this.statusCode = errorCode
  }
}
