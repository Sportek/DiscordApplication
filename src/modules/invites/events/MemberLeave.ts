import { GuildMember, TextChannel } from "discord.js";
import { Application, BaseEvent, Event } from "@sportek/core-next-sportek";
import { InviteManageData } from "App/modules/invites/InviteManageData";
import { ConfigManager } from "App/defaults/ConfigManager";
import { getDefaultEmbed } from "App/defaults/MessageManager";

@Event('guildMemberRemove')
export default class MemberLeave implements BaseEvent {
  public async run(member: GuildMember): Promise<void> {
    const data = InviteManageData.getInstance()
    const memberData = await data.getPlayerData(member.id)
    if(memberData) {
      await data.inviteRemove(memberData.inviterid, 1);
      // const embed = InviteManageData.getInstance().getJoinAndLeaveLogEmbed(member.user, await Application.getClient().users.fetch(memberData.inviterid),false);
      // const channel = await Application.getClient().channels.fetch(ConfigManager.getInvitesConfiguration().logInvite) as TextChannel;
      // await channel.send({embeds: [embed]});
    }
    // const configuration = ConfigManager.getInvitesConfiguration().memberLeave

    // if(configuration){
    // 	const channel = await member.guild.channels.fetch(ConfigManager.getInvitesConfiguration().channelid) as TextChannel;
    // 	const embed = getDefaultEmbed("Invitations")
    // 			.setDescription(ConfigManager.replaceManyToVariables(configuration, [{name: "guildName", variable: member.guild.name}, {name: "playerUsername", variable: member.user.username}, {name: "memberCount", variable: member.guild.memberCount.toString()}]))
    // 	await channel.send({embeds: [embed]});
    // }

  }
}
