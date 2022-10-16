import { Model, } from 'sequelize'
import { ROLES, } from 'Config/constants'
import uuid from 'uuid-random'

export default (sequelize, dataTypes) => {
  class User extends Model {}

  User.init({
    id: {
      type: dataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: dataTypes.STRING,
    login: dataTypes.STRING,
    password: dataTypes.STRING,
    publicId: {
      type: dataTypes.UUID,
      unique: true,
    },
    role: {
      type: dataTypes.STRING,
      defaultValue: ROLES.USER,
    },
  }, {
    modelName: 'user',
    paranoid: true,
    deletedAt: 'disabledAt',
    hooks: {
      beforeCreate: user => {
        user.publicId = uuid()
      },
    },
    sequelize,
  })

  return User
}
