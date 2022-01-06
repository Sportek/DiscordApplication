import { BaseEvent, Event } from 'ioc:factory/Core/Event'
import { GuildMember, Interaction, Message, TextChannel } from 'discord.js'
import { getDefaultEmbed, sendEphemeralMessage } from "App/defaults/MessageManager";
import { CaptchaManager } from "App/modules/captcha/CaptchaManager";
import { Captcha } from "App/modules/captcha/Captcha";

@Event('interactionCreate')
export default class ResetCaptcha extends BaseEvent {
  public async run(interaction: Interaction): Promise<void> {
    if(!interaction.isButton()) return;
    if(interaction.customId !== "incorrect-captcha") return;
    const member = interaction.member as GuildMember;
    const message = interaction.message as Message;
    const userid = message.embeds[0].footer?.text

    /*
    * Check if it's player captcha
    * */

    if(member.id !== userid) {
      await sendEphemeralMessage(interaction, "Impossible de changer ce captcha étant donné qu'il ne vous appartient pas.", false);
      return;
    }

    // Remove message
    await message.delete()

    /*
    * Generate new captcha
    * */

    CaptchaManager.getInstance().removePlayerFromList(userid)
    await CaptchaManager.getInstance().generateCanvas(member.id);
    const channel = interaction.channel as TextChannel;
    const newCaptcha = await channel.send(await CaptchaManager.getInstance().sendMessage(member, true))
    await sendEphemeralMessage(interaction, `Votre captcha a été réinitialisé, le voici: [captcha](${ newCaptcha.url })`, true);
    CaptchaManager.getInstance().messages.push({userid: userid, messageid: newCaptcha.id})


    const logChannel = await message.guild?.channels.fetch(Captcha.getConfiguration().logsID) as TextChannel;
    const embed = getDefaultEmbed("Captcha")
      .setDescription(`${ member } (${ member?.displayName }) a réinitialisé son captcha.`)
    await logChannel.send({embeds: [embed]})

    setTimeout(async args => {
      try {
        await newCaptcha.edit(await CaptchaManager.getInstance().sendMessage(member, false))
      } catch (e){

      }
    }, 10000)
  }
}