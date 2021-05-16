import { Provider } from '@discord-factory/core'

export default class AppProvider implements Provider {
  public async boot(): Promise<void> {
    // Your code here
  }

  public async loadFile(file): Promise<void> {
    // Your code here
  }

  public async ready(): Promise<void> {
    // Your code here
  }
}