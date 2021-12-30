import {CommandInteraction, GuildChannel} from 'discord.js'
import { BaseCommand, Command } from "@sportek/core-next-sportek";
import { ConfigManager } from "App/defaults/ConfigManager";
import { getCommandPermission } from "App/defaults/PermissionManager";
import { getDefaultEmbed } from "App/defaults/MessageManager";
import Logger from "@leadcodedev/logger";

@Command({
  scope: [ConfigManager.getBaseConfiguration().guild.id],
  permissions: getCommandPermission("modération"),
  options: {
    name: 'unlock',
    description: "Permet de débloquer un channel.",
    options: [],
  },
})
export default class Lock extends BaseCommand {
  // @ts-ignore
  public async run(interaction: CommandInteraction): Promise<void> {

    try{
      const channel = interaction.channel! as GuildChannel;
      const roles = ConfigManager.getModerationConfiguration().lockMuted
      for (const value of roles) {
        await channel.permissionOverwrites.edit(value, {"SEND_MESSAGES": true})
      }
      const embed = getDefaultEmbed("Sanctions")
          .setDescription("Vous venez de débloquer le salon avec succès.")
      await interaction.reply({embeds: [embed]})
    } catch (e) {
      await interaction.reply("Une erreur est survenue.")
      Logger.send("error", e+"");
    }
  }
}
