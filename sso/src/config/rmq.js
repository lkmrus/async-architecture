import amqp from 'amqplib'
import { RABBIT_CONNECTION, } from 'Config/constants'

const connection = () => amqp.connect(RABBIT_CONNECTION, {
  keepAlive: true,
})

export default connection()
