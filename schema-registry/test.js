const Ajv = require('ajv')
const error = require('./tools/errors.js')
const userSchema = require('./schemas/user/cud/1.json') // assert { type: 'json' }

const ajv = new Ajv({ allErrors: true })

// TODO Setup of schemas
ajv.addSchema(userSchema)

const checkSchema = (eventName, objectValue = {}) => {
  const isEvent = ajv.getSchema(eventName)
  if (isEvent instanceof Function) {
    const result = isEvent(objectValue)

    if (!result || (result && result.errors)) {
      throw new error.SchemaValidationError(
        `Validation error: ${eventName} schema is not valid`
      )
    } else {
      console.log(eventName, result)
      return true
    }
  } else {
    throw new error.SchemaNotFoundError(eventName)
  }
}

// checkEvent
checkSchema('user.registered', {
  pattern: 'user.registered',
  data: {
    userId: '94',
    publicId: '415ccf3b-2015-4bae-b3a3-e81fc3bfa3fc',
    request: {
      name: 'Ruslan',
      login: 'admin3334@test.ru',
      password: '$2a$10$eWOsgXpGGVJEpIyQMB.j6eEd191qviYkLOw3tD5J5at0x8e7niBd6',
    },
    response: {
      role: 'user',
      id: '94',
      name: 'Ruslan',
      login: 'admin3334@test.ru',
      updatedAt: '2022-10-21T20:19:36.474Z',
      createdAt: '2022-10-21T20:19:36.474Z',
      publicId: '415ccf3b-2015-4bae-b3a3-e81fc3bfa3fc',
      disabledAt: null,
    },
    date: '2022-10-21T20:19:36.494Z',
  },
})
module.exports = {
  checkSchema,
}
