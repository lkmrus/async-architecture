import { db, } from 'Config'
import { makeHash, } from 'Utils/makeHash'

export default class UserService {
  getUsers({ limit, offset, }) {
    return db.user.findAll({
      limit: limit ?? 100,
      offset: offset ?? 0,
      order: [['id', 'ASC']],
      attributes: { exclude: ['password'], },
    })
  }

  async updatePassword(userId, password) {
    const hash = await makeHash(password)
    await db.user.update({ password: hash, }, { where: { id: userId, }, })
    return true
  }

  async updateProfile(userId, data) {
    await db.user.update(data, { where: { id: userId, }, })
    return true
  }
}
