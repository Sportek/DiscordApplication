import { Message } from "discord.js";
import { BaseEvent, Event } from "@sportek/core-next-sportek";
import { WarningCollection } from "App/modules/moderation/collections/WarningCollection";
import { ConfigManager } from "App/defaults/ConfigManager";


@Event('messageCreate')
export default class NoSpamTagWave implements BaseEvent {
  public async run(message: Message): Promise<void> {
    if(ConfigManager.getModerationConfiguration().automaticSanctions.spamTagWave) {
      if(message.channel.type === "DM") return;
      if(message.author.bot) return;
      const member = message.member!;
      if(member.roles.cache.some(r => ConfigManager.getBaseConfiguration().guild.roles.administration.includes(r.id))) return;
      if(message.mentions.users.size > 4) {
        await WarningCollection.getInstance().addWarning(member, message, "Trop de mentions");
      }
    }
  }
}
