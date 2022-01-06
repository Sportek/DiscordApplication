import { CommandInteraction } from 'discord.js'
import { BaseCommand, Command } from "@sportek/core-next-sportek";
import { ConfigManager } from "App/defaults/ConfigManager";
import { getTopInviteEmbed } from "App/modules/invites/GetTopEmbed";

@Command({
  scope: [ConfigManager.getBaseConfiguration().guild.id],
  options: {
    name: 'top-invites',
    description: "Permet d'obtenir le classement des invitations.",
    options: [],
  },
})
export default class TopInvitesCommand extends BaseCommand {
  public async run(interaction: CommandInteraction): Promise<void> {
    await interaction.reply({embeds: [await getTopInviteEmbed()], ephemeral: true});
  }
}
