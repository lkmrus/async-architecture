import { Model, UUIDV4, } from 'sequelize'

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
      defaultValue: UUIDV4,
      allowNull: false,
    },
    userId: dataTypes.BIGINT,
    balance: {
      type: dataTypes.FLOAT,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'bill',
    paranoid: true,
  })

  return Bill
}
