import { db, } from 'Config'
import { random, } from 'lodash'

export default class TaskService {
  static findList(filter = {}, order = [], limit= 1000, offset = 0) {
    return db.task.findAll({ where: filter, limit, offset, order, })
  }

  static find(id) {
    return db.task.findByPk(id)
  }

  static async create({ userId, title, jiraId = null, status= 'TODO', order, }) {
    const tasks = await this.findList({ userId, }, [['userId', 'DESC']])
    const ordering = !order ? tasks.length ? tasks[0].order + 1 : 1 : order
    return db.task.create({ userId, title, jiraId, status, order: ordering, })
  }

  static async assignTask({ taskId, userId, }) {
    return db.task.update({ userId, status: 'ACTIVE', }, { where: {
      id: taskId,
    }, }).then(([res]) => res ? this.find(taskId) : null)
  }

  static async shuffleTasks(userId) {
    const userTasks = await this.findList({ userId, })
    await Promise.all(
      userTasks.map(
        task => db.task.update({ order: Math.floor(random(1, 1000)), }, { where: { id: task.id, }, })
      )
    )
    return this.findList({ userId, })
  }

  static async completeTask(taskId) {
    return db.task.update({ completedAt: new Date(), status: 'COMPLETED', }, { where: {
      id: taskId,
    }, }).then(([res]) => res ? this.find(taskId) : null)
  }
}
