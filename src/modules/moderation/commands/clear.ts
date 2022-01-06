import {CommandInteraction, TextChannel} from 'discord.js'
import { BaseCommand, Command } from "@sportek/core-next-sportek";
import { ConfigManager } from "App/defaults/ConfigManager";
import { getCommandPermission } from "App/defaults/PermissionManager";
import { getDefaultEmbed, sendEphemeralMessage } from "App/defaults/MessageManager";

@Command({
  scope: [ConfigManager.getBaseConfiguration().guild.id],
  permissions: getCommandPermission("modération"),
  options: {
    name: 'clear',
    description: 'Permet de clear les messages du channel.',
    options: [{
      name: "nombre",
      description: "Nombre de messages",
      type: "NUMBER",
      required: true
    }],
  },
})
export default class Clear extends BaseCommand {
  // @ts-ignore
  public async run(interaction: CommandInteraction): Promise<void> {
    const count = interaction.options.getNumber("nombre")!;
    if(count < 1 || count > 99){
      await sendEphemeralMessage(interaction, "Vous devez indiquer un nombre entre 1 et 99.", false)
      return;
    }

    const channel = interaction.channel! as TextChannel;
    await channel.bulkDelete(count+1);
    const embed = getDefaultEmbed("Sanctions")
        .setDescription(`\`📌\` **${count}** messages ont été supprimés par ${interaction.member}`);
    await interaction.reply({embeds: [embed]});
  }
}
