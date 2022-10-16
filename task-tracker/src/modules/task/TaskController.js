import { isAdmin, isManager, } from 'Utils/auth'
import { ForbiddenError, } from 'Exceptions'
import TaskService from './TaskService'
import { NotFoundError, } from 'Exceptions'

export default class TaskController {
  static async getTasks({ query, user, }) {
    const { filter = {}, offset = 0, limit, } = query

    if (isAdmin(user) || isManager(user)) {
      return TaskService.findList(filter,[['id']], limit, offset)
    }

    if (!user) {
      throw new ForbiddenError('Try to login again')
    }
    return TaskService.findList({ userId: user.id, }, limit, offset , { order: [['order', 'DESC']], })
  }

  static async createTask({ body, }) {
    return TaskService.create(body)
  }

  static async assignTask({ body, user, }) {
    const task = await TaskService.find(body.taskId)
    if (!task) {
      throw new NotFoundError()
    }

    if (!isAdmin(user) && !isManager(user)) {
      throw new ForbiddenError('Only admin and manager can assign tasks')
    }

    return TaskService.assignTask(body)
  }

  static async completeTask({ body, user, }) {
    const task = await TaskService.find(body.taskId)
    if (!task) {
      throw new NotFoundError()
    }

    if (user.id !== task.userId && !isAdmin(user) && !isManager(user)) {
      throw new ForbiddenError('You can only complete tasks assigned to him')
    }

    return TaskService.completeTask(body.taskId)
  }
}
