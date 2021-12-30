import { BaseEvent, Event } from 'ioc:factory/Core/Event'
import { VoiceState } from 'discord.js'
import { getTemporaryChannelByChannelID } from "App/modules/temporaryChannels/TemporaryChannelManager";
import { ConfigManager } from "App/defaults/ConfigManager";
import { sendPrivateConfirmation } from "App/defaults/MessageManager";
import ChannelData from "App/modules/temporaryChannels/database/models/ChannelData";
import Logger from "@leadcodedev/logger";

@Event('voiceJoin')
export default class UserJoinChannel extends BaseEvent {
  public async run(state: VoiceState): Promise<void> {

    try {
      const member = state.member!;
      const channel = state.channel!;

      if(channel.id !== ConfigManager.getTemporaryChannelConfiguration().channel.id) return;
      const channelData = await getTemporaryChannelByChannelID(channel.id)
      if(channelData) {
        const oldChannel = await member.guild.channels.fetch(channelData.channel_id);
        if(oldChannel) {
          await member.voice.disconnect();
          await sendPrivateConfirmation(member, `Vous avez déjà un salon vocal: ${ oldChannel }`, false)
          return;
        }
      }

      const newChannel = await member.guild.channels.create(`🎧 Salon de ${ member.displayName }`, {
        type: "GUILD_VOICE",
        parent: channel.parent?.id,
        permissionOverwrites: [{id: member.id, type: "member", allow: ["VIEW_CHANNEL", "CONNECT"]}]
      });

      await member.voice.setChannel(newChannel)

      await ChannelData.create({
        owner_id: member.id,
        channel_id: newChannel.id
      })
    } catch (e) {
      Logger.send("error", "Erreur: " + e)
    }
  }
}