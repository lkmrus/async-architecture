const path = require('path')
const fs = require('fs')
const { ajv } = require('./ajv.singleton')
const {
  SchemaNotFoundError,
  SchemaValidationError: ValidationError,
} = require('./errors')

const isObject = (obj) => {
  return obj instanceof Object && !(obj instanceof Array)
}

const serialize = (object) => {
  if (!isObject(object)) {
    throw new ValidationError('Serialization error')
  }

  return Buffer.from(JSON.stringify(object))
}

const deserialize = (buffer) => {
  let result
  try {
    result = JSON.parse(buffer.toString())
    if (!isObject(result)) {
      throw new ValidationError('Serialization error')
    }
    return result
  } catch (e) {
    throw new ValidationError('Serialization error')
  }
}

const validateSchema = (schemaName, file) => {
  if (!schemaName || !ajv.getSchema(schemaName)) {
    console.error(`Error: schema "${schemaName}" not found`)

    return
  }
  if (!file) {
    console.error('Error: file not specified')

    return
  }

  const json = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), file), 'utf8')
  )

  try {
    validateSchema({ pattern: schemaName, data: json })
  } catch (e) {
    console.error(`Error: ${e.message}\n${JSON.stringify(e.meta, null, 2)}`)

    return
  }

  console.log('Success: schema is valid')
}

const validate = (input) => {
  const check = ajv.getSchema(input.pattern)
  if (!check) {
    throw new SchemaNotFoundError(input.pattern)
  }
  check({ pattern: input.pattern, data: input.data })

  if (check.errors) {
    throw new ValidationError('Validation error', {
      topic: input.pattern,
      payload: input.data,
      errors: ajv.errorsText(check.errors),
    })
  }
}

module.exports = {
  serialize,
  deserialize,
  validateSchema,
  validate,
}
