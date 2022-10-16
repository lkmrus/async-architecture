import { Model, } from 'sequelize'

export default (sequelize, dataTypes) => {
  class User extends Model {}

  User.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: dataTypes.BIGINT,
    },
    userId: dataTypes.BIGINT,
    publicId: dataTypes.UUID,
  }, {
    sequelize,
    modelName: 'user',
    paranoid: true,
    updatedAt: false,
  })

  return User
}
