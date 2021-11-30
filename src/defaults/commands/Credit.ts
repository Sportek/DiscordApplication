import { Command, BaseCommand } from 'ioc:factory/Core/Command'
import { CommandInteraction, version } from 'discord.js'
import { ConfigManager } from "App/defaults/ConfigManager";
import { Application } from "@sportek/core-next-sportek";
import { getFormatedTimeFromSeconds } from "App/defaults/TimeManager";
import { getDefaultEmbed } from "App/defaults/MessageManager";

@Command({
  scope: [ConfigManager.getBaseConfiguration().guild.id],
  options: {
    name: 'credit',
    description: 'Information du bot.',
    options: []
  }
})
export default class Credit extends BaseCommand {
  // @ts-ignore
  public async run (interaction: CommandInteraction): Promise<void> {
    const embed = getDefaultEmbed("Utilitaires")
        .setTitle(`Informations à propos du bot ${Application.getClient().user!.username}`)
        .addField("Version", ConfigManager.getBaseConfiguration().instance.version, true)
        .addField("Créateur", "Sportek#3432", true)
        .addField("**Maintenance**", `NodeJS: ${process.version}\nDiscordJS: v${version}\nUtilisation mémoire: ${Math.round(process.memoryUsage().heapUsed/1024/1024*100)/100} MB\nDurée de fonctionnement: ${getFormatedTimeFromSeconds(process.uptime())}\n[Prise de commande de bot](https://discord.gg/UF6bvgycqn 'Clique pour obtenir ton bot!')`)
    await interaction.reply({embeds: [embed], ephemeral: true})
  }
}