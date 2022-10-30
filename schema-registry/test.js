const Ajv = require('ajv')
const error = require('./tools/errors.js')
const userRegisteredSchema = require('./schemas/user/cud/user_registered/1.json') // assert { type: 'json' }
const taskCreatedSchema = require('./schemas/task/cud/task_created/1.json')
// const taskCreatedSchemaV2 = require('./schemas/task/cud/task_created/2.json')
const taskAssignedSchema = require('./schemas/task/be/task_assigned/1.json')
const taskCompletedSchema = require('./schemas/task/be/task_completed/1.json')

const ajv = new Ajv({ allErrors: true })

// TODO Setup of schemas
ajv.addSchema(userRegisteredSchema)
ajv.addSchema(taskCreatedSchema)
// ajv.addSchema(taskCreatedSchemaV2)
ajv.addSchema(taskAssignedSchema)
ajv.addSchema(taskCompletedSchema)

// TODO времнный вариант
const checkSchema = (eventName, objectValue = {}) => {
  const isEvent = ajv.getSchema(eventName)
  if (isEvent instanceof Function) {
    const result = isEvent(objectValue)

    if (!result || (result && result.errors)) {
      throw new error.SchemaValidationError(
        `Validation error: ${eventName} schema is not valid`
      )
    } else {
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
