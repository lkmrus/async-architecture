export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('tasks', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.BIGINT,
    },
    userId: Sequelize.STRING,
    title: Sequelize.STRING,
    status: Sequelize.STRING,
    order: Sequelize.INTEGER,
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    completedAt: Sequelize.DATE,
    deletedAt: Sequelize.DATE,
  })
}

export const down = async queryInterface => {
  return queryInterface.dropTable('tasks')
}
