import { readdirSync, } from 'fs'
import { basename as _basename, join, } from 'path'
import Sequelize, { DataTypes, } from 'sequelize'
import { constants, } from 'Config'
import { logger, } from 'Utils'

const db = () => {
  const db = {}
  const pathToDb = join(__filename, '../db')
  const basename = _basename(pathToDb)

  const env = constants.NODE_ENV || 'development'
  const config = require(join(__dirname, './dbConf'))[env]

  let sequelizeConfig = config
  if (constants.NODE_ENV !== 'production' && constants.LOG_LEVEL) {
    sequelizeConfig.logging = msg => logger.info(msg)
  }
  else {
    sequelizeConfig = config
  }

  const sequelize = new Sequelize(config.database, config.username, config.password, sequelizeConfig)

  const pathToModels = '../db/models'
  const pathToFiles = join(__dirname, pathToModels)
  readdirSync(pathToFiles)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && ((file.slice(-3) === '.js'))
    })
    .forEach(file => {
      const pathToFile = join(__dirname, pathToModels, file)
      const model = require(pathToFile).default(sequelize, DataTypes)
      db[model.name] = model
    })

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
  })

  db.sequelize = sequelize
  db.Sequelize = Sequelize

  return db
}

export default db()
