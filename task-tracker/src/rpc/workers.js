import TaskService from 'Modules/task/TaskService'
import { publish, } from './RabbitService'
import { EVENTS, EXCHANGES, } from './index'
import UserService from 'Modules/user/UserService'
import { checkSchema, } from 'SchemaRegistryLib'

export const workerTaskShuffle = async msg => {
  checkSchema(msg.pattern, msg)
  const tasks = await TaskService.shuffleTasks(msg.data.response.id)
  await publish(EXCHANGES.CUD_EVENTS, EVENTS.TASKS_SHUFFLED, { tasks, ownerId: msg.data.userId, }, 'topic')
}

export const workerCreateUser = async msg => {
  checkSchema(msg.pattern, msg)
  await UserService.create(msg.data.userId, msg.data.publicId)
}
