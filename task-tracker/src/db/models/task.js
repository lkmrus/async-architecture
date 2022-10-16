import { Model, } from 'sequelize'

export default (sequelize, dataTypes) => {
  class Task extends Model {}

  Task.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: dataTypes.BIGINT,
    },
    userId: dataTypes.STRING,
    title: dataTypes.STRING,
    status: dataTypes.STRING,
    order: dataTypes.INTEGER,
    completedAt: dataTypes.DATE,
  }, {
    sequelize,
    modelName: 'task',
    paranoid: true,
    updatedAt: false,
  })

  return Task
}
