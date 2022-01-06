import { BaseEvent, Event } from 'ioc:factory/Core/Event'
import { CaptchaManager } from "App/modules/captcha/CaptchaManager";
import { GuildMember, TextChannel } from "discord.js";
import { Application } from "@sportek/core-next-sportek";
import Logger from "@leadcodedev/logger";
import { getDefaultEmbed } from "App/defaults/MessageManager";
import fs from "fs";
import { Captcha } from "App/modules/captcha/Captcha";

// @ts-ignore
@Event('fullReady')
export default class DisableCaptchaAfterTime extends BaseEvent {
  public async run(any): Promise<void> {

    setInterval(async () => {
      const endList = CaptchaManager.getInstance().list.filter(value => value.timestamp + 5 * 60 * 1000 <= (Date.now()));
      for (const value of endList) {
        const user = value.userid
        for (const value1 of CaptchaManager.getInstance().getPlayerListFromMessage(user)) {
          try {
            const channel = await Application.getClient().channels.fetch(Captcha.getConfiguration().channelID) as TextChannel;
            const message = await channel.messages.resolve(value1.messageid)
            if(message) {
              const member = (await message.guild?.members.fetch(user)) as GuildMember;
              await message.delete()
              if(member.roles.cache.has(Captcha.getConfiguration().restrictingRole)) {
                await member.kick()
              }
              CaptchaManager.getInstance().removePlayerFromList(user)
              const logChannel = await message.guild?.channels.fetch(Captcha.getConfiguration().logsID) as TextChannel;
              const embed = getDefaultEmbed("Captcha")
                .setDescription(`${ member } (${ member.displayName }) a été expulsé, il n'a pas rempli le captcha dans les temps.`)
              await logChannel.send({embeds: [embed]})
            }
            fs.rmSync(`./security/${ value.userid }.png`);
          } catch (e) {
            Logger.send("error", `Une erreur est survenue lors d'un captcha: ${ e }`)
          }
        }

      }
    }, 15 * 1000)
  }
}