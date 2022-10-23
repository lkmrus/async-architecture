export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('transactions', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.BIGINT,
    },
    taskId: Sequelize.STRING,
    bill: Sequelize.UUID,
    deposit: Sequelize.FLOAT,
    credit: Sequelize.FLOAT,
    date: Sequelize.DATE,
    deletedAt: Sequelize.DATE,
  })
}

export const down = async queryInterface => {
  return queryInterface.dropTable('transactions')
}
