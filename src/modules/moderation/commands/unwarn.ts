import {CommandInteraction, GuildMember} from 'discord.js'
import { BaseCommand, Command } from "@sportek/core-next-sportek";
import { ConfigManager } from "App/defaults/ConfigManager";
import { getCommandPermission } from "App/defaults/PermissionManager";
import SanctionSave from "App/modules/moderation/database/models/SanctionSave";
import { sendEphemeralMessage } from "App/defaults/MessageManager";


@Command({
  scope: [ConfigManager.getBaseConfiguration().guild.id],
  permissions: getCommandPermission("modération"),
  options: {
    name: 'unwarn',
    description: "Permet d'unwarn un utilisateur",
    options: [{
      name: "utilisateur",
      description: "Utilisateur qui sera unwarn.",
      type: "USER",
      required: true
    },
      {
        name: "warnid",
        description: "Numéro du warn.",
        type: "NUMBER",
        required: true
      }],
  },
})
export default class Unwarn extends BaseCommand {
  // @ts-ignore
  public async run(interaction: CommandInteraction): Promise<void> {
    const member = interaction.options.getMember("utilisateur")! as GuildMember;
    const warnid = interaction.options.getNumber("warnid")!;

    const data = await SanctionSave.findBy<SanctionSave>( {playerid: member.id, warnid: warnid, bantype: "warn"});
    if(!data){
      await sendEphemeralMessage(interaction, "Impossible de retirer ce warn, il est inexistant.", false);
      return;
    }
    await data.delete();
    await sendEphemeralMessage(interaction, "Le warn a été retiré avec succès.", true);
  }
}
