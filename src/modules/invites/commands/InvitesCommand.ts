import {CommandInteraction, GuildMember} from 'discord.js'
import { BaseCommand, Command } from "@sportek/core-next-sportek";
import { sendEphemeralMessage } from "App/defaults/MessageManager";
import { InviteManageData } from "App/modules/invites/InviteManageData";
import { ConfigManager } from "App/defaults/ConfigManager";

@Command({
  scope: [ConfigManager.getBaseConfiguration().guild.id],
  options: {
    name: 'invites',
    description: "Permet d'obtenir les invitations d'un utilisateur.",
    options: [{
      name: "utilisateur",
      description: "Utilisateur ciblé.",
      type: "USER",
      required: false
    }],
  },
})
export default class InvitesCommand extends BaseCommand {

  public async run(interaction: CommandInteraction): Promise<void> {
    let target = interaction.options.getMember("utilisateur") as GuildMember;
    if(!target) {
      target = interaction.member! as GuildMember;
    }
    const data = await InviteManageData.getInstance().getPlayerData(target.id);
    if(target != interaction.member) {
      if (data) {
        await sendEphemeralMessage(interaction, `**${target.displayName}** a actuellement **${data.invitecount}** ${data.invitecount <= 1 ? "invitation" : "invitations"}!`, true)
      } else {
        await sendEphemeralMessage(interaction, `**${target.displayName}** a actuellement **0** invitation!`, true)
      }
    } else {
      if(data){
        await sendEphemeralMessage(interaction, `Vous avez actuellement **${data.invitecount}** ${data.invitecount <= 1 ? "invitation" : "invitations"}!`, true)
      } else {
        await sendEphemeralMessage(interaction, `Vous avez actuellement **0** invitation!`, true)
      }
    }

  }
}
