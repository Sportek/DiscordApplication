import { Command, BaseCommand } from 'ioc:factory/Core/Command'
import { CommandInteraction, GuildMember, TextChannel } from 'discord.js'
import { ConfigManager } from "App/defaults/ConfigManager";
import { sendEphemeralMessage } from "App/defaults/MessageManager";
import MessageUpdate from "App/defaults/database/models/MessageUpdate";
import { Application } from "@sportek/core-next-sportek";
import { getTopInviteEmbed } from "App/modules/invites/GetTopEmbed";
import { getCommandPermission } from "App/defaults/PermissionManager";

@Command({
  scope: [ConfigManager.getBaseConfiguration().guild.id],
  permissions: getCommandPermission("administration"),
  options: {
    name: 'invite-setup',
    description: 'Permet de mettre en place le système d\'invitations fixe.',
    options: []
  }
})
export default class InviteSetup extends BaseCommand {
  public async run(interaction: CommandInteraction): Promise<void> {
    const data = await MessageUpdate.findBy({messagetype: "invite-top"}) as MessageUpdate;
    const member = interaction.member as GuildMember;
    const channel = interaction.channel as TextChannel;

    if(data) {
      await data.delete();
    }

    const embed = await getTopInviteEmbed()

    embed.setTitle(`Classement automatique des invitations`)
    embed.setDescription(embed.description + `\n\n\`⌚\` Prochaine actualisation: <t:${ Math.floor((Date.now() + 5 * 60 * 1000) / 1000) }:R>`)
    embed.setFooter("✨ Concours d'invitations en cours!", Application.getClient()!.user?.avatarURL()!)
    const message = await channel.send({embeds: [embed]});

    await MessageUpdate.create({
      messagetype: "invite-top",
      channelid: channel.id,
      messageid: message.id
    })

    await sendEphemeralMessage(interaction, "Le message des invitations a bien été mis en place.", true)
  }
}