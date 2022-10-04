import { UserService, } from 'Config/singletones'

export class UserController extends UserService {
  getUsers({ query, }) {
    return super.getUsers(query)
  }

  changePassword({ body, user, }) {
    return super.updatePassword(user.id, body.password)
  }

  changeProfile({ body, params, }) {
    return super.updateProfile(params.id, body)
  }
}
