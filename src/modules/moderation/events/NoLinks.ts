import { Message } from "discord.js";
import { BaseEvent, Event } from "@sportek/core-next-sportek";
import { ConfigManager } from "App/defaults/ConfigManager";
import { WarningCollection } from "App/modules/moderation/collections/WarningCollection";

@Event('messageCreate')
export default class NoLinks implements BaseEvent {
  public async run(message: Message): Promise<void> {

    if(ConfigManager.getModerationConfiguration().automaticSanctions.noLinks.enable) {

      const messageContent = message.content;
      const allowedLink = ConfigManager.getModerationConfiguration().automaticSanctions.noLinks.allowedLinks
      const member = message.member!;

      const part = messageContent.split(" ");
      for (const value of part) {
        if(value.includes("https://") || value.includes("www.")) {
          let allowed = false;
          allowedLink.forEach(value1 => {
            if(value.includes(value1)) allowed = true;
          })

          if(!allowed) {
            if(member.roles.cache.some(r => ConfigManager.getBaseConfiguration().guild.roles.administration.includes(r.id))) return;
            await WarningCollection.getInstance().addWarning(member, message, "Link");
            await message.delete();
          }
        }
      }
    }
  }
}
