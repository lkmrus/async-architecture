import { RoleService, } from 'Config/singletones'

export class RoleController extends RoleService {
  assignRole({ body, params, }) {
    return super.changeRole(params.id, body.role)
  }
}
