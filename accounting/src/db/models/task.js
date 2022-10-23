import { Model, } from 'sequelize'

export default (sequelize, dataTypes) => {
  class Task extends Model {}

  Task.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: dataTypes.BIGINT,
    },
    // taskPublicId
    taskId: dataTypes.STRING,
    cost: dataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'task',
    paranoid: true,
  })

  return Task
}
