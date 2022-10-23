import { random, } from 'lodash'

export const randomIncrement = (min, max) => {
  return Math.floor(random(min, max))
}
