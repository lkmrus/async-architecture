import { db, } from 'Config'

export default class UserService {
  static findList(filter = {}, order = [], limit= 1000, offset = 0) {
    return db.user.findAll({ where: filter, limit, offset, order, })
  }

  static async create(id, publicId) {
    return db.user.create({ userId: id, publicId, })
  }
}
