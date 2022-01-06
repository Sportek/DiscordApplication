import { BaseEvent, Event } from 'ioc:factory/Core/Event'
import { GuildMember, TextChannel } from 'discord.js'
import { CaptchaManager } from "App/modules/captcha/CaptchaManager";
import { Captcha } from "App/modules/captcha/Captcha";

@Event('guildMemberAdd')
export default class MemberJoin extends BaseEvent {
  public async run (member: GuildMember): Promise<void> {
    await member.roles.add(Captcha.getConfiguration().restrictingRole)
    const guild = member.guild;
    const channel = await guild.channels.fetch(Captcha.getConfiguration().channelID) as TextChannel;
    await CaptchaManager.getInstance().generateCanvas(member.id);
    const message = await channel.send(await CaptchaManager.getInstance().sendMessage(member, false));
    CaptchaManager.getInstance().messages.push({userid: member.id, messageid: message.id});

  }
}