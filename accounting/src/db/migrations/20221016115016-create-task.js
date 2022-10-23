export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('tasks', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.BIGINT,
    },
    taskId: Sequelize.STRING,
    cost: Sequelize.FLOAT,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
    deletedAt: Sequelize.DATE,
  })
}

export const down = async queryInterface => {
  return queryInterface.dropTable('tasks')
}
