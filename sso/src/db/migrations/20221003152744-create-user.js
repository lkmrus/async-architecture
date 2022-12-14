export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.BIGINT,
    },
    name: Sequelize.STRING,
    login: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: Sequelize.STRING,
    role: Sequelize.STRING,
    publicId: Sequelize.UUID,
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    disabledAt: {
      allowNull: true,
      type: Sequelize.DATE,
    },
  })
}

export const down = async queryInterface => {
  return queryInterface.dropTable('users')
}
