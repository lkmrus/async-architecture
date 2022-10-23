import { Model, UUIDV4, } from 'sequelize'

export default (sequelize, dataTypes) => {
  class Task extends Model {}

  Task.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: dataTypes.BIGINT,
    },
    userId: dataTypes.BIGINT,
    publicId: {
      type: dataTypes.STRING,
      defaultValue: UUIDV4,
    },
    title: dataTypes.STRING,
    jiraId: dataTypes.STRING,
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
