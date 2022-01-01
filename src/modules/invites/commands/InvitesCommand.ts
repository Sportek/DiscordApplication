import { CommandInteraction, GuildMember } from 'discord.js'
import { BaseCommand, Command } from "@sportek/core-next-sportek";
import { sendEphemeralMessage } from "App/defaults/MessageManager";
import { InviteManageData } from "App/modules/invites/InviteManageData";
import { ConfigManager } from "App/defaults/ConfigManager";
import { hasMinimumRoleRequired } from "App/defaults/PermissionManager";

@Command({
  scope: [ConfigManager.getBaseConfiguration().guild.id],
  options: {
    name: 'invites',
    description: "Permet d'interagir avec les invitations d'un utilisateurs.",
    options: [{
      name: 'info',
      description: "Permet d'obtenir le nombre d'invitations d'un utilisateur.",
      type: "SUB_COMMAND",
      options: [{
        name: "utilisateur",
        description: "Utilisateur ciblé.",
        type: "USER",
        required: true
      }]
    },
      {
        name: 'add',
        description: "Permet d'ajouter des invitations à un utilisateur.",
        type: "SUB_COMMAND",
        options: [{
          name: "utilisateur",
          description: "Utilisateur ciblé.",
          type: "USER",
          required: true
        },
          {
            name: "nombre",
            description: "Nombre d'invitations.",
            type: "INTEGER",
            required: true
          }]
      },
      {
        name: 'remove',
        description: "Permet de retirer des invitations à un utilisateur.",
        type: "SUB_COMMAND",
        options: [{
          name: "utilisateur",
          description: "Utilisateur ciblé.",
          type: "USER",
          required: true
        },
          {
            name: "nombre",
            description: "Nombre d'invitations.",
            type: "INTEGER",
            required: true
          }]
      }],
  },
})
export default class InvitesCommand extends BaseCommand {

  public async run(interaction: CommandInteraction): Promise<void> {

    if(interaction.options.getSubcommand() === "info") {
      let target = interaction.options.getMember("utilisateur") as GuildMember;
      if(!target) {
        target = interaction.member! as GuildMember;
      }
      const data = await InviteManageData.getInstance().getPlayerData(target.id);
      if(target != interaction.member) {
        if(data) {
          await sendEphemeralMessage(interaction, `**${ target.displayName }** a actuellement **${ data.invitecount }** ${ data.invitecount <= 1 ? "invitation" : "invitations" }!`, true)
        } else {
          await sendEphemeralMessage(interaction, `**${ target.displayName }** a actuellement **0** invitation!`, true)
        }
      } else {
        if(data) {
          await sendEphemeralMessage(interaction, `Vous avez actuellement **${ data.invitecount }** ${ data.invitecount <= 1 ? "invitation" : "invitations" }!`, true)
        } else {
          await sendEphemeralMessage(interaction, `Vous avez actuellement **0** invitation!`, true)
        }
      }
      return;
    }

    const amount = interaction.options.getInteger("nombre")!;
    const user = interaction.options.getUser("utilisateur")!;
    const member = interaction.member as GuildMember;

    if(!hasMinimumRoleRequired(member, ConfigManager.getBaseConfiguration().guild.roles.administration)) {
      await sendEphemeralMessage(interaction, "Vous n'avez pas les rôles suffisant pour effectuer cette commande.", false);
      return;
    }

    if(interaction.options.getSubcommand() === "add") {
      await InviteManageData.getInstance().inviteAdd(user.id, amount);
      await sendEphemeralMessage(interaction, `Vous venez d'ajouter **${ amount }** invitations à ${ user }!`, true);
      return;
    }

    if(interaction.options.getSubcommand() === "remove") {
      await InviteManageData.getInstance().inviteRemove(user.id, amount);
      await sendEphemeralMessage(interaction, `Vous venez de retirer **${ amount }** invitations à ${ user }!`, true);
      return;
    }


  }
}
