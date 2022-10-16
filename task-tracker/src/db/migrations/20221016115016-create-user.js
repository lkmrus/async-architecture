export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('users', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.BIGINT,
    },
    userId: Sequelize.STRING,
    publicId: Sequelize.UUID,
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    deletedAt: Sequelize.DATE,
  })
}

export const down = async queryInterface => {
  return queryInterface.dropTable('users')
}
