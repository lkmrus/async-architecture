import { makeHash, } from 'Utils'
import { ROLES, } from 'Config/constants'

export const up = async queryInterface => {
  const hash = await makeHash('123456')

  return queryInterface.bulkInsert('users', [ {
    name: 'Administrator',
    login: 'admin',
    role: ROLES.ADMIN,
    password: hash,
    createdAt: new Date(),
    updatedAt: new Date(),
  } ], {})
}

export const down = queryInterface => {
  return queryInterface.bulkDelete('users', null, {})
}
