import db from 'Config/db'
import { math, } from 'Utils'

export default class TaskService {
  static setTaskCost(publicTaskId) {
    return db.task.findOrCreate({ where: { taskId: publicTaskId, }, defaults: { taskId: publicTaskId, cost: math.randomIncrement(20, 40), }, })
  }
}

