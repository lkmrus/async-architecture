import { db, } from 'Config'

const me = userId => {
  return db.user.findOne({ where: { id: userId, }, attributes: { exclude: ['password'], }, })
    .then(data => data ? data.dataValues : data)
}

export default me
