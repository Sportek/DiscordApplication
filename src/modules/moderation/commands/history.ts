import {CommandInteraction} from 'discord.js'
import { BaseCommand, Command } from "@sportek/core-next-sportek";
import { ConfigManager } from "App/defaults/ConfigManager";
import { getCommandPermission } from "App/defaults/PermissionManager";
import SanctionSave from "App/modules/moderation/database/models/SanctionSave";
import { getDefaultEmbed, sendEphemeralMessage } from "App/defaults/MessageManager";
import { convertTimestampToDate } from "App/defaults/TimeManager";
import { DurationsEnum } from "App/modules/moderation/enums/DurationsEnum";

@Command({
  scope: [ConfigManager.getBaseConfiguration().guild.id],
  permissions: getCommandPermission("modération"),
  options: {
    name: 'history',
    description: "Permet d'obtenir l'historique d'un utilisateur.",
    options: [{
      name: 'utilisateur',
      type: 'USER',
      required: true,
      description: "Utilisateur ciblé.",
    }],
  },
})
export default class History extends BaseCommand {
  // @ts-ignore
  public async run(interaction: CommandInteraction): Promise<void> {

    const querriedPlayer = interaction.options.getUser("utilisateur")!;
    const bd = await SanctionSave.where<SanctionSave>({playerid: querriedPlayer.id});

    if (bd.length === 0) {
      await sendEphemeralMessage(interaction, "Ce joueur n'a jamais été sanctionné", true);
      return;
    }

    const dbQuerry = await SanctionSave.getQuery().where({playerid: querriedPlayer.id}).orderBy('date', 'DESC').limit(10);


    const embed = getDefaultEmbed("Sanctions")
        .setTitle(`Sanctions de ${querriedPlayer.tag}`)
        .setDescription(`
        Nombre de mutes: ${bd.filter(value => value.bantype === "mute").length}
        Nombre de bans: ${bd.filter(value => value.bantype === "ban").length}
        Nombre de warns: ${bd.filter(value => value.bantype === "warn").length}
        Nombre total de sanctions: ${bd.length}
        `);


    dbQuerry.forEach((value) => {
      if(value.banType === "warn"){
        embed.addField(`📌 ${value.bantype.toUpperCase()}`, `**➥ Raison:** ${value.reason}\n**➥ #Warn:** ${value.warnid}\n**➥ Date: **${convertTimestampToDate(value.date)}\n**➥ Modérateur:** <@${value.moderator}>`)
      } else {
        embed.addField(`📌 ${value.bantype.toUpperCase()}`, `**➥ Raison:** ${value.reason}\n**➥ Durée:** ${DurationsEnum[value.duration]}\n**➥ Date: **${convertTimestampToDate(value.date)}\n**➥ Modérateur:** <@${value.moderator}>`)
      }
    })

    await interaction.reply({embeds: [embed], ephemeral: true});

  }
}
