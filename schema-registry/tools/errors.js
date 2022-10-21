class SchemaValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'SchemaValidationError'
  }
}

class SchemaNotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name = 'SchemaNotFoundError'
  }
}

module.exports = {
  SchemaValidationError,
  SchemaNotFoundError,
}
