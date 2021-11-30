import { BaseProvider, EntityResolvable } from 'ioc:factory/Core/Provider'
import Logger from '@leadcodedev/logger'
import { Application } from "@sportek/core-next-sportek";

export default class AppProvider implements BaseProvider {
  public async boot (): Promise<void> {
    Logger.send('info', 'Application start')
    // Your code here
  }

  public async load (Class: EntityResolvable): Promise<void> {
    Logger.send('info', `Load file ${Class.file?.relativePath}`)
    // Your code here
  }

  public async ok (): Promise<void> {
    Logger.send('info', 'Application is ready')
    Application.getClient().emit("fullReady");
  }
}