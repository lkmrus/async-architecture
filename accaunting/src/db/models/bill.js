import { Model, } from 'sequelize'

export default (sequelize, dataTypes) => {
  class Bill extends Model {}

  Bill.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: dataTypes.BIGINT,
    },
    bill: {
      unique: true,
      type: dataTypes.UUID,
    },
    userId: dataTypes.BIGINT,
    balance: dataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'bill',
    paranoid: true,
  })

  return Bill
}