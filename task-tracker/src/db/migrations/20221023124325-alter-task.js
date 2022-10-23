export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('tasks', 'jiraId', { type: Sequelize.STRING, allowNull: true, })
}

export const down = async queryInterface => {
  await queryInterface.removeColumn('tasks', 'jiraId')
}
