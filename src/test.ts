import { Event, BaseEvent } from 'ioc:factory/Core/Event'
import { Message } from 'ioc:factory/Discord/Event'

@Event('messageCreate')
export default class MyEvent extends BaseEvent {
  public async run (message: Message) {
  }
}