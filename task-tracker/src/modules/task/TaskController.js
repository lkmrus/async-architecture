import { isAdmin, isManager, } from 'Utils/auth'
import { ForbiddenError, } from 'Exceptions'
import TaskService from './TaskService'
import { NotFoundError, } from 'Exceptions'
import { pick, } from 'lodash'
import { EVENTS, EXCHANGES, } from '../../rpc'
import { publish, } from '../../rpc/RabbitService'
import { eventDataBuilder, } from '../../common/utils'

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

  static async createTask(req) {
    const query = pick(req.body, 'userId', 'title', 'status', 'order')
    const matchTitle = query.title.match(/(\[.*])(.*)/)

    if (matchTitle) {
      query.title = matchTitle[2]?.trim()
      query.jiraId = matchTitle[1]?.replace('[', '').replace(']', '').trim()
    }

    const res = await TaskService.create(query)
    await publish(EXCHANGES.CUD_EVENTS, EVENTS.TASK_CREATED, eventDataBuilder(req, res.dataValues))
    await publish(EXCHANGES.BUSINESS_EVENTS, EVENTS.TASK_ASSIGNED, eventDataBuilder(req, res.dataValues))
    return res
  }

  static async assignTask(req) {
    const task = await TaskService.find(req.body.taskId)
    if (!task) {
      throw new NotFoundError()
    }

    if (!isAdmin(req.user) && !isManager(req.user)) {
      throw new ForbiddenError('Only admin and manager can assign tasks')
    }

    const res = await TaskService.assignTask(req.body)
    await publish(EXCHANGES.BUSINESS_EVENTS, EVENTS.TASK_ASSIGNED, eventDataBuilder(req, res.dataValues))
    return res
  }

  static async completeTask(req) {
    const task = await TaskService.find(req.body.taskId)
    if (!task) {
      throw new NotFoundError()
    }

    if (req.user.id !== task.userId && !isAdmin(req.user) && !isManager(req.user)) {
      throw new ForbiddenError('You can only complete tasks assigned to him')
    }

    const res = await TaskService.completeTask(req.body.taskId)
    await publish(EXCHANGES.BUSINESS_EVENTS, EVENTS.TASK_COMPLETED, eventDataBuilder(req, res.dataValues))
    return res
  }
}
