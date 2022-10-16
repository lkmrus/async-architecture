import { Model, } from 'sequelize'
import { ROLES, } from 'Config/constants'

export default (sequelize, dataTypes) => {
  class User extends Model {}

  User.init({
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: dataTypes.STRING,
    login: dataTypes.STRING,
    password: dataTypes.STRING,
    role: {
      type: dataTypes.STRING,
      defaultValue: ROLES.USER,
    },
  }, {
    sequelize,
    modelName: 'user',
    paranoid: true,
    deletedAt: 'disabledAt',
  })

  return User
}
