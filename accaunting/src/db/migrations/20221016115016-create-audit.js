export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('money', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.BIGINT,
    },
    taskId: Sequelize.BIGINT,
    bill: Sequelize.UUID,
    debit: Sequelize.FLOAT,
    credit: Sequelize.FLOAT,
    date: Sequelize.DATE,
    deletedAt: Sequelize.DATE,
  })
}

export const down = async queryInterface => {
  return queryInterface.dropTable('money')
}
