class SchemaValidationError extends Error {
  constructor(message, meta = {}) {
    super(message)
    this.name = 'SchemaValidationError'
    this.stack = this.stack
      + Object.entries(meta)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')
      + '.'
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
