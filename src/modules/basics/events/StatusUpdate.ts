import { BaseEvent, Event } from 'ioc:factory/Core/Event'
import { Application } from "@sportek/core-next-sportek";

// @ts-ignore
@Event('fullReady')
export default class StatusUpdate extends BaseEvent {
  public async run (any : any): Promise<void> {
    Application.getClient()!.user!.setPresence({
      activities: [{name: "https://nefarion.fr", type: "COMPETING"}], status: "online",
    })
  }
}