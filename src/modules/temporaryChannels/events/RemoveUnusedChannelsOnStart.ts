import { Event, BaseEvent } from 'ioc:factory/Core/Event'
import ChannelData from "App/modules/temporaryChannels/database/models/ChannelData";
import { Application } from "@sportek/core-next-sportek";
import { VoiceChannel } from "discord.js";

// @ts-ignore
@Event('fullReady')
export default class RemoveUnusedChannelsOnStart extends BaseEvent {
  public async run(any: any): Promise<void> {
    const data = await ChannelData.findAll() as ChannelData[]

    for (const value of data) {
      const channel = await Application.getClient().channels.fetch(value.channel_id) as VoiceChannel
      if(channel){
        if(channel.members.size){
          await value.delete()
        }
      }
    }
  }
}