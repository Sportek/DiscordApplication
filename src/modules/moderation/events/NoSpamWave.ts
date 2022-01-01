import { BaseEvent, Event } from 'ioc:factory/Core/Event'
import { Message, TextChannel } from 'discord.js'
import { SpamWaveManager } from "App/modules/moderation/SpamWaveManager";
import { ConfigManager } from "App/defaults/ConfigManager";
import Logger from "@leadcodedev/logger";

@Event('messageCreate')
export default class NoSpamWave extends BaseEvent {
  public async run (message: Message): Promise<void> {

    if(message.author.bot) return;
    if(ConfigManager.getModerationConfiguration().notRestrictedChannels.includes(message.channelId)) return;
    SpamWaveManager.getInstance().increaseMessage(message.channelId)
    const info = SpamWaveManager.getInstance().getChannelInfo(message.channelId)
    if(info.message % ConfigManager.getModerationConfiguration().limitMessagePerMinute === 0){
      const channel = message.channel as TextChannel;
      let newTimeIndex = SpamWaveManager.getInstance().time.indexOf(channel.rateLimitPerUser)+1
      if(newTimeIndex > SpamWaveManager.getInstance().time.length-1) {
        newTimeIndex = SpamWaveManager.getInstance().time.length-1
      }
      await channel.edit({rateLimitPerUser: SpamWaveManager.getInstance().time[newTimeIndex]})
      Logger.send('warn', `Le maximum de message dans le salon ${channel.name} a été atteint, le slowmode a donc été augmenté à ${SpamWaveManager.getInstance().time[newTimeIndex]} secondes.`)
    }
  }
}
