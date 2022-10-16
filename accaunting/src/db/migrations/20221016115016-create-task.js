export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('task', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.BIGINT,
    },
    taskId: Sequelize.UUID,
    cost: Sequelize.FLOAT,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
    deletedAt: Sequelize.DATE,
  })
}

export const down = async queryInterface => {
  return queryInterface.dropTable('task')
}
