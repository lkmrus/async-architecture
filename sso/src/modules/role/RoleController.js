import RoleService from './RoleService'

export default class RoleController {
  static assignRole({ body, params, }) {
    return RoleService.changeRole(params.id, body.role)
  }
}
