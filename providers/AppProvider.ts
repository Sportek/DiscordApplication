import { Provider } from '@discord-factory/core'
import Motd from '@discord-factory/motd'

export default class AppProvider implements Provider {
  public async boot(): Promise<void> {
    // Your code here
    await new Motd().start()
  }

  public async loadFile(file): Promise<void> {
    // Your code here
  }

  public async ready(): Promise<void> {
    // Your code here
  }
}