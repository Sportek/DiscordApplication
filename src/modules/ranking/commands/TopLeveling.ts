import {CommandInteraction} from 'discord.js'
import { ConfigManager } from "App/defaults/ConfigManager";
import { Application, BaseCommand, Command } from "@sportek/core-next-sportek";
import { Player } from "App/modules/ranking/Player";
import { getDefaultEmbed } from "App/defaults/MessageManager";
import PlayerData from "App/modules/ranking/database/models/PlayerData";

@Command({
  scope: [ConfigManager.getBaseConfiguration().guild.id],
  options: {
    name: 'top-level',
    description: "Permet d'obtenir le top des niveaux.",
    options: [],
  },
})
export default class TopLeveling implements BaseCommand {
  // @ts-ignore
  public async run(interaction: CommandInteraction): Promise<void> {

    let message = "";
    let i = 1;
    const dbQuerry = await PlayerData.getQuery().orderBy('experience', "DESC").limit(10) as PlayerData[];
    for (const value of dbQuerry) {
      let number;
      switch (i) {
        case 1:
          number ="🏆";
          break;
        case 2:
          number ="🥈";
          break;
        case 3:
          number ="🥉";
          break;
        default:
          number = i;
          break;
      }

      const player = await new Player(value.userid).initialize();

      message += `\n${number} **${(await Application.getClient()!.users.fetch(value.userid)).username}** - Niveau **${player.getLeveling().level}** - Expérience ${player.getLeveling().remainingExperience}/${player.getLeveling().neededExperience}`;
      i++;
    }

    const embed = getDefaultEmbed("Niveaux")
        .setDescription(message)

    await interaction.reply({embeds: [embed], ephemeral: true});

  }
}
