import { BaseCommand, Command } from 'ioc:factory/Core/Command'
import { CommandInteraction } from 'discord.js'
import { ConfigManager } from "App/defaults/ConfigManager";
import { getCommandPermission } from "App/defaults/PermissionManager";
import { sendDeferredMessage } from "App/defaults/MessageManager";
import Logger from "@leadcodedev/logger";
import { Captcha } from "App/modules/captcha/Captcha";

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
        const role = await guild.roles.fetch(Captcha.getConfiguration().restrictingRole)
        if(role) {
          const channels = await guild.channels.fetch()
          channels.forEach(value => {
            if(value.id !== Captcha.getConfiguration().channelID) value.permissionOverwrites.edit(Captcha.getConfiguration().restrictingRole, {VIEW_CHANNEL: false})
            else {
              value.permissionOverwrites.edit(Captcha.getConfiguration().restrictingRole, {VIEW_CHANNEL: true})
              value.permissionOverwrites.edit(ConfigManager.getBaseConfiguration().guild.id, {VIEW_CHANNEL: false})
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