import app from './api'
import { constants, db, } from 'Config'

db.sequelize.authenticate()
  .then(() => app.ready())
  .then(() => app.listen(constants.APP_PORT, constants.APP_HOST))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
