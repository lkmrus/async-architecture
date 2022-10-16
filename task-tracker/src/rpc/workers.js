import TaskService from 'Modules/task/TaskService'
import { publish, } from './RabbitService'
import { EVENTS, EXCHANGES, } from './index'
import UserService from 'Modules/user/UserService'

export const workerTaskShuffle = async data => {
  if (data.message?.response?.id) {
    const tasks = await TaskService.shuffleTasks(data.message.response.id)
    await publish(EXCHANGES.CUD_EVENTS, EVENTS.TASKS_SHUFFLED, { tasks, ownerId: data.message.userId, }, 'topic')
  }
}

export const workerCreateUser = async data => {
  if (data.message) {
    await UserService.create(data.message.userId, data.message.publicId)
  }
}
