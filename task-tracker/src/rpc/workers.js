import TaskService from 'Modules/task/TaskService'
import { publish, } from './RabbitService'
import { EVENTS, EXCHANGES, } from './index'

export const workerTaskShuffle = async data => {
  if (data.message) {
    const tasks = await TaskService.shuffleTasks(data.message.userId.toString())
    await publish(EXCHANGES.CUD_EVENTS, EVENTS.TASKS_SHUFFLED, { tasks, ownerId: data.message.userId, }, 'topic')
  }
}
