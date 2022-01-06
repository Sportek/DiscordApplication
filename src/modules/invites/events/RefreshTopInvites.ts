import { TextChannel } from "discord.js";
import { Application, BaseEvent, Event } from "@sportek/core-next-sportek";
import MessageUpdate from "App/defaults/database/models/MessageUpdate";
import { getTopInviteEmbed } from "App/modules/invites/GetTopEmbed";
import Logger from "@leadcodedev/logger";

// @ts-ignore
@Event('fullReady')
export default class RefreshTopInvites implements BaseEvent {
  public async run(args: any): Promise<void> {
    setInterval(async () => {

      try{
        const data = await MessageUpdate.findBy( {messagetype: "invite-top"}) as MessageUpdate;
        if(!data) {
          return;
        }
        const channel = await Application.getClient()?.channels.fetch(data.channelid) as TextChannel;
        if(!channel) {
          return;
        }
        const message = await channel.messages.fetch(data.messageid);
        if(!message) {
          return;
        }
        const embed = await getTopInviteEmbed()
        embed.setTitle(`Classement automatique des invitations`)
        embed.setDescription(embed.description+`\n\n\`⌚\` Prochaine actualisation: <t:${Math.floor((Date.now() + 5*60*1000)/1000)}:R>`)
        embed.setFooter("✨ Concours d'invitations en cours!", Application.getClient()!.user?.avatarURL()!)
        await message.edit({embeds: [embed]})
      } catch (e){
        const data = await MessageUpdate.findBy( {messagetype: "invite-top"}) as MessageUpdate;
        await data.delete()
        Logger.send("error", `Le message du top invite a été supprimé : ` + e)
      }
    }, 3*60*1000)
  }
}
