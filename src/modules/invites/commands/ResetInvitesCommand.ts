import { CommandInteraction, GuildMember } from 'discord.js'
import { BaseCommand, Command } from "@sportek/core-next-sportek";
import { getCommandPermission } from "App/defaults/PermissionManager";
import Logger from "@leadcodedev/logger";
import { sendEphemeralMessage } from "App/defaults/MessageManager";
import { InviteManageData } from "App/modules/invites/InviteManageData";
import { ConfigManager } from "App/defaults/ConfigManager";

@Command({
  scope: [ConfigManager.getBaseConfiguration().guild.id],
  permissions: getCommandPermission("administration"),
  options: {
    name: 'resetinvites',
    description: "Permet de réinitialiser les invitations d'un utilisateur ou de l'ensemble des membres.",
    options: [{
      name: "user",
      description: "Permet de réinitialiser les invitations d'un utilisateur.",
      type: "SUB_COMMAND",
      options: [{
        name: "utilisateur",
        type: "USER",
        description: "Utilisateur ciblé.",
        required: true
      }]
    },
      {
        name: "all",
        description: "Permet de réinitialiser l'ensemble des invitations du serveur.",
        type: "SUB_COMMAND"
      }],
  },
})
export default class ResetInvitesCommand extends BaseCommand {
  // @ts-ignore
  public async run(interaction: CommandInteraction): Promise<void> {
    if(interaction.options.getSubcommand() === "user") {
      const moderator = interaction.member! as GuildMember;
      const member = interaction.options.getMember("utilisateur")! as GuildMember;
      const manager = InviteManageData.getInstance();
      const data = await manager.getPlayerData(member.id);
      if(!data) {
        await sendEphemeralMessage(interaction, "Cet utilisateur ne possède pas d'invitations.", true)
        return;
      }
      await manager.inviteRemove(member.id, data.invitecount);
      await sendEphemeralMessage(interaction, `Vous venez de reset les invitations de **${ member.displayName }**.`, true);
      Logger.send("success", `${ moderator.displayName } vient de supprimer les invitations de ${ member.displayName }.`);
    }


    if(interaction.options.getSubcommand() === "all"){
      const moderator = interaction.member! as GuildMember;
      await InviteManageData.getInstance().removeAllInvites();
      await sendEphemeralMessage(interaction, "Vous venez de supprimer l'ensemble des invitations.", true);
      Logger.send("success", `${ moderator.displayName } vient de supprimer l'ensemble des invitations.`);
    }


  }
}
