import { Queue, } from 'bullmq'

const EVENTS = {
  USER_REGISTERED: 'user.registered',
  USER_LOGIN: 'user.login',
}

export const userLogin = new Queue(EVENTS.USER_LOGIN)
export const userRegistered = new Queue(EVENTS.USER_REGISTERED)
