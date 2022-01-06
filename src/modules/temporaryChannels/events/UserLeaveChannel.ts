import { Event, BaseEvent } from 'ioc:factory/Core/Event'
import { VoiceChannel, VoiceState } from 'discord.js'
import { getTemporaryChannelByChannelID } from "App/modules/temporaryChannels/TemporaryChannelManager";

@Event('voiceLeave')
export default class UserLeaveChannel extends BaseEvent {
  public async run(state: VoiceState): Promise<void> {
    const channel = state.channel!;
    const member = state.member!;
    const channelData = await getTemporaryChannelByChannelID(channel.id)
    if(!channelData) return;
    if(channel.members.size === 0) {
      await channel.delete()
      await channelData.delete()
    }
  }
}