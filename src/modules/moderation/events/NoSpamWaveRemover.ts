import { Event, BaseEvent } from 'ioc:factory/Core/Event'
import { SpamWaveManager } from "App/modules/moderation/SpamWaveManager";

// @ts-ignore
@Event('fullReady')
export default class NoSpamWaveRemover extends BaseEvent {
  public async run (any): Promise<void> {
    SpamWaveManager.getInstance().resetChannelsInfo()

  }
}