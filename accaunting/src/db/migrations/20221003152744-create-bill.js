import { UUIDV4, } from 'sequelize'

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('bills', {
    bill: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: UUIDV4,
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
