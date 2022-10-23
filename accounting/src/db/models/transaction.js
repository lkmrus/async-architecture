import { Model, } from 'sequelize'

export default (sequelize, dataTypes) => {
  class Transaction extends Model {}

  Transaction.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: dataTypes.BIGINT,
    },
    bill: dataTypes.UUID,
    deposit: dataTypes.FLOAT,
    credit: dataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'transaction',
    paranoid: true,
    createdAt: 'date',
    updatedAt: false,
  })

  return Transaction
}
