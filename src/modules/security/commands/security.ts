import { BaseCommand, Command } from 'ioc:factory/Core/Command'
import { CommandInteraction, GuildChannel, MessageActionRow, MessageButton, TextChannel } from 'discord.js'
import { ConfigManager } from "App/defaults/ConfigManager";
import { getCommandPermission } from "App/defaults/PermissionManager";
import { CaptchaManager } from "App/modules/security/CaptchaManager";
import { getDefaultEmbed, sendDeferredMessage, sendEphemeralMessage } from "App/defaults/MessageManager";
import Logger from "@leadcodedev/logger";

@Command({
  scope: [ConfigManager.getBaseConfiguration().guild.id],
  permissions: getCommandPermission("administration"),
  options: {
    name: 'security',
    description: 'Permet de sécuriser le serveur.',
    options: [{
      name: "setup",
      description: "Permet de setup la sécurité.",
      type: "SUB_COMMAND"
    }]
  }
})
export default class Security extends BaseCommand {
  public async run(interaction: CommandInteraction): Promise<void> {
    if(interaction.options.getSubcommand() === "setup") {
      try {
        await interaction.deferReply({ephemeral: true})
        const guild = interaction.guild!;
        const role = await guild.roles.fetch(ConfigManager.getSecurityConfiguration().restrictingRole)
        if(role) {
          const channels = await guild.channels.fetch()
          channels.forEach(value => {
            if(value.id !== ConfigManager.getSecurityConfiguration().channelID) value.permissionOverwrites.set([{
              id: ConfigManager.getSecurityConfiguration().restrictingRole,
              type: "role",
              deny: "VIEW_CHANNEL"
            }])
            else {
              value.permissionOverwrites.set([{
                id: ConfigManager.getSecurityConfiguration().restrictingRole,
                type: "role",
                allow: "VIEW_CHANNEL"
              },
                {id: ConfigManager.getBaseConfiguration().guild.id, type: "role", deny: "VIEW_CHANNEL"}]);
            }
          })
          await sendDeferredMessage(interaction, "Vous venez de modifier l'ensemble des salons pour rendre fonctionnel le système de captcha!", true);
        }
      } catch (e) {
        await sendDeferredMessage(interaction, "Une erreur s'est produite lors de la mise en place du système de captcha", false);
        Logger.send("error", `Erreur lors de la mise en place du captcha: ${ e }`);
      }
    }
  }
}