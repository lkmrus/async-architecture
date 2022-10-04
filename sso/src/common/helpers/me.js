import { db, } from 'Config'

export default userId => {
  return db.user.findOne({ where: { id: userId, }, })
}
