import { BaseProvider, EntityResolvable } from 'ioc:factory/Core/Provider'
import Logger from '@leadcodedev/logger'

export default class AppProvider implements BaseProvider {
  public async boot (): Promise<void> {
    // Your code here
    Logger.send('info', 'Application start')
  }

  public async load (Class: EntityResolvable): Promise<void> {
    // Your code here
    Logger.send('info', `Load file ${Class.file?.path}`)
  }

  public async ok (): Promise<void> {
    Logger.send('info', 'Application is ready')
  }
}