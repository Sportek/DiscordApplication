import { CommandInteraction, GuildMember, TextChannel } from 'discord.js'
import { Application, BaseCommand, Command } from "@sportek/core-next-sportek";
import { ConfigManager } from "App/defaults/ConfigManager";
import { getCommandPermission } from "App/defaults/PermissionManager";
import SanctionSave from "App/modules/moderation/database/models/SanctionSave";
import { getDefaultEmbed, sendEphemeralMessage } from "App/defaults/MessageManager";
import { Moderation } from "App/modules/moderation/Moderation";

@Command({
  scope: [ConfigManager.getBaseConfiguration().guild.id],
  permissions: getCommandPermission("modération"),
  options: {
    name: 'warn',
    description: 'Permet de warn un utilisateur',
    options: [{
      name: "utilisateur",
      description: "Utilisateur qui sera warn.",
      type: "USER",
      required: true
    },
      {
        name: "raison",
        description: "Raison du warn.",
        type: "STRING",
        required: true
      }],
  },
})
export default class Warn implements BaseCommand {
  // @ts-ignore
  public async run(interaction: CommandInteraction): Promise<void> {

    const player = interaction.options.getUser("utilisateur")!;
    const reason = interaction.options.getString("raison")!;
    const moderator = interaction.member as GuildMember;


    let number: number | undefined;
    const db = await SanctionSave.getQuery().where({playerid: player.id}).orderBy("warnid", "DESC").limit(1) as SanctionSave
    number = db?.warnid
    if(!number) number = 0;
    number++;


     await SanctionSave.create({
      playerid: player.id,
      banType: "warn",
      date: Date.now(),
      reason: reason,
      duration: 0,
      moderator: moderator.id,
      warnid: number
    })

    await sendEphemeralMessage(interaction, `Vous avez warn avec succès ${player} pour la raison: ${reason}.`, true);

    const embed = getDefaultEmbed("Sanctions")
        .setAuthor(moderator.user.username, moderator.user.avatarURL()!)
        .setTitle(`${Application.getClient()?.user?.username} ➜ Sanctions`)
        .setDescription(`\`📌\` **Joueur sanctionné:** ${player.tag} (${player.id}) 
        \`📌\` **Type de sanction:** warn
        \`📌\` **WarnID:** ${number}
        \`📌\` **Raison:** ${reason}`);

    const moderatorLogger = await Application.getClient()?.channels.fetch(Moderation.getConfiguration().channelModerationLogs) as unknown as TextChannel
    await moderatorLogger.send({embeds:[embed]});

  }
}
