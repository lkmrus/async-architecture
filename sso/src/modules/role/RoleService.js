import { db, } from 'Config'

export default class RoleService {
  async changeRole(userId, role) {
    await db.user.update({ role, }, { where: { id: userId, }, })
    return true
  }
}
