import { BaseEvent, Event } from 'ioc:factory/Core/Event'
import { CaptchaManager } from "App/modules/security/CaptchaManager";
import { ConfigManager } from "App/defaults/ConfigManager";
import { GuildMember, TextChannel } from "discord.js";
import { Application } from "@sportek/core-next-sportek";
import Logger from "@leadcodedev/logger";
import { getDefaultEmbed } from "App/defaults/MessageManager";

// @ts-ignore
@Event('fullReady')
export default class DisableCaptchaAfterTime extends BaseEvent {
  public async run(any): Promise<void> {

    setInterval(async () => {

      // console.log("List: " + CaptchaManager.getInstance().list.map(value => `{Code: ${value.code}, UserID: ${value.userid}, TimeStamp: ${value.timestamp}}`).join(", "))
      // console.log("Messages: " + CaptchaManager.getInstance().messages.map(value => `{MessageiD: ${value.messageid}, UserID: ${value.userid}}`).join(", "))

      const endList = CaptchaManager.getInstance().list.filter(value => value.timestamp + 5 * 60 * 1000 <= (Date.now()));
      for (const value of endList) {
        const user = value.userid

        for (const value1 of CaptchaManager.getInstance().getPlayerListFromMessage(user)) {

          try {
            const channel = await Application.getClient().channels.fetch(ConfigManager.getSecurityConfiguration().channelID) as TextChannel;
            const message = await channel.messages.resolve(value1.messageid)
            if(message) {
              const member = (await message.guild?.members.fetch(user)) as GuildMember;
              await message.delete()
              if(member.roles.cache.has(ConfigManager.getSecurityConfiguration().restrictingRole)) {
                await member.kick()
              }
              CaptchaManager.getInstance().removePlayerFromList(user)
              const logChannel = await message.guild?.channels.fetch(ConfigManager.getSecurityConfiguration().logsID) as TextChannel;
              const embed = getDefaultEmbed("Captcha")
                .setDescription(`${ member } (${ member.displayName }) a été expulsé, il n'a pas rempli le captcha dans les temps.`)
              await logChannel.send({embeds: [embed]})
            }
          } catch (e) {
            Logger.send("error", `Une erreur est survenue lors d'un captcha: ${ e }`)
          }
        }

      }
    }, 15 * 1000)
  }
}