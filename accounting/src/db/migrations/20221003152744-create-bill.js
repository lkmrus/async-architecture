export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('bills', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.BIGINT,
    },
    bill: {
      unique: true,
      type: Sequelize.UUID,
    },
    userId: Sequelize.BIGINT,
    balance: Sequelize.FLOAT,
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: Sequelize.DATE,
    deletedAt: Sequelize.DATE,
  })
}

export const down = async queryInterface => {
  return queryInterface.dropTable('bills')
}
