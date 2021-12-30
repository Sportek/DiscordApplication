import InvitesData from "App/modules/invites/database/models/InvitesData";
import { Application } from "@sportek/core-next-sportek";
import { getDefaultEmbed } from "App/defaults/MessageManager";

export async function getTopInviteEmbed() {

  let message = ""
  let i = 1;

  const dbQuerry = await InvitesData.getQuery().orderBy('invitecount', "DESC").limit(10);
  for (const value of dbQuerry) {
    let number;
    switch (i) {
      case 1:
        number = "🏆";
        break;
      case 2:
        number = "🥈";
        break;
      case 3:
        number = "🥉";
        break;
      default:
        number = i;
        break;
    }

    message += `\n${ number }** ${ (await Application.getClient()!.users.fetch(value.userid)).username }** - **${ value.invitecount }** invitations`;

    i++;
  }

  return getDefaultEmbed("Invitations")
    .setDescription(message);

}