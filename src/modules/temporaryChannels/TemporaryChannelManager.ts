import { CommandInteraction, GuildMember, Snowflake } from "discord.js";
import ChannelData from "App/modules/temporaryChannels/database/models/ChannelData";
import { sendEphemeralMessage } from "App/defaults/MessageManager";


export async function getTemporaryChannelByChannelID(channelId: Snowflake) {
  return await ChannelData.findBy({channel_id: channelId}) as ChannelData
}

export async function getTemporaryChannelByOwner(member: GuildMember) {
  return await ChannelData.findBy({owner_id: member.id}) as ChannelData
}

export async function userHasPermissionCommand(interaction: CommandInteraction): Promise<boolean> {
  const member = interaction.member! as GuildMember;
  if(!(await getTemporaryChannelByOwner(member))) {
    await sendEphemeralMessage(interaction, "Vous n'avez aucun salon dont vous êtes le propiétaire.", false);
    return false;
  }

  return true;
}