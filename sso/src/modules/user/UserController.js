import UserService from './UserService'

export default class UserController {
  static getUsers({ query, }) {
    return UserService.getUsers(query)
  }

  static changePassword({ body, user, }) {
    return UserService.updatePassword(user.id, body.password)
  }

  static changeProfile({ body, params, }) {
    return UserService.updateProfile(params.id, body)
  }
}
