import { GuildMember } from "discord.js";
import { BaseEvent, Event } from "@sportek/core-next-sportek";
import { InviteManageData } from "App/modules/invites/InviteManageData";

@Event('guildMemberRemove')
export default class MemberLeave implements BaseEvent {
  public async run(member: GuildMember): Promise<void> {
    const data = InviteManageData.getInstance()
    const memberData = await data.getPlayerData(member.id)
    if(memberData) {
      await data.inviteRemove(memberData.inviterid, 1);
    }
  }
}
