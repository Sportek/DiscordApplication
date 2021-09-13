import { Hook, BaseHook } from 'ioc:factory/Core/Hook'
import { Client } from 'discord.js'

@Hook('application::ok')
export default class MyHook extends BaseHook {
  public async run (client: Client) {
  }
}