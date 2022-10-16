import { makeHash, } from 'Utils'
import { ROLES, } from 'Config/constants'
import uuid from 'uuid-random'

export const up = async queryInterface => {
  const hash = await makeHash('123456')

  return queryInterface.bulkInsert('users', [ {
    id: '1',
    name: 'Administrator',
    login: 'admin',
    role: ROLES.ADMIN,
    publicId: uuid(),
    password: hash,
    createdAt: new Date(),
    updatedAt: new Date(),
  } ], {})
}

export const down = queryInterface => {
  return queryInterface.bulkDelete('users', null, {})
}
