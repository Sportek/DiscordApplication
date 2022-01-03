import { Event, BaseEvent } from 'ioc:factory/Core/Event'
import { Message, TextChannel } from 'discord.js'
import { ConfigManager } from "App/defaults/ConfigManager";
import { CaptchaManager } from "App/modules/security/CaptchaManager";
import Logger from "@leadcodedev/logger";
import { getDefaultEmbed } from "App/defaults/MessageManager";
import fs from "fs";

@Event('messageCreate')
export default class AnswerCaptcha extends BaseEvent {
  public async run (message: Message): Promise<void> {

    const channel = message.channel as TextChannel;
    const member = message.member;
    if(member?.user.bot) return;
    if(channel.id !== ConfigManager.getSecurityConfiguration().channelID) return
    if(!member?.roles.cache.has(ConfigManager.getSecurityConfiguration().restrictingRole)) return;
    await message.delete()
    const code = CaptchaManager.getInstance().getPlayerList(member.id)[0].code
    if(!message.content.startsWith(code)) return;
    try{
      member?.roles.remove(ConfigManager.getSecurityConfiguration().restrictingRole)
      await channel.messages.delete(CaptchaManager.getInstance().getPlayerListFromMessage(member.id)[0].messageid)
      CaptchaManager.getInstance().removePlayerFromList(member?.id)

      const logChannel = await message.guild?.channels.fetch(ConfigManager.getSecurityConfiguration().logsID) as TextChannel;
      const embed = getDefaultEmbed("Captcha")
        .setDescription(`${message.member} (${message.member?.displayName}) a réussi le Captcha! :tada:`)
      await logChannel.send({embeds: [embed]})
      fs.rmSync(`./security/${ member?.id }.png`);
    } catch (e){
      Logger.send("error", `Une erreur a été détecté dans un captcha: ${e}`)
    }





  }
}