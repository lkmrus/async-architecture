import { Model, } from 'sequelize'

export default (sequelize, dataTypes) => {
  class Bill extends Model {}

  Bill.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: dataTypes.BIGINT,
    },
    bill: dataTypes.UUID,
    debit: dataTypes.FLOAT,
    credit: dataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'user',
    paranoid: true,
    createdAt: 'date',
    updatedAt: false,
  })

  return Bill
}
