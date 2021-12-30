import { Guild, Invite } from "discord.js";
import { Application, BaseEvent, Event } from "@sportek/core-next-sportek";
import { InviteCollection } from "App/modules/invites/InviteCollection";
import { ConfigManager } from "App/defaults/ConfigManager";

@Event('inviteDelete')
export default class InviteDelete implements BaseEvent {
  public async run(invite: Invite): Promise<void> {
    const guild = await Application.getClient().guilds.fetch(ConfigManager.getBaseConfiguration().guild.id);
    const inviteGuild = invite.guild as Guild;
    const invites = await inviteGuild.invites.fetch()
    InviteCollection.getInstance().defineInvites(invites)
  }
}
