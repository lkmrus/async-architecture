import uuid from 'uuid-random'

export const up = async queryInterface => {
  return queryInterface.bulkInsert('bills', [ {
    userId: '1',
    bill: uuid(),
    balance: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  } ], {})
}

export const down = queryInterface => {
  return queryInterface.bulkDelete('bills', null, {})
}
