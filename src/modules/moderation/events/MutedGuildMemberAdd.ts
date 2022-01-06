
import {GuildMember} from "discord.js";
import { BaseEvent, Event } from "@sportek/core-next-sportek";
import SanctionnedList from "App/modules/moderation/database/models/SanctionnedList";
import { ConfigManager } from "App/defaults/ConfigManager";
import { Moderation } from "App/modules/moderation/Moderation";


@Event('guildMemberAdd')
export default class MutedGuildMemberAdd implements BaseEvent {
	public async run(member: GuildMember): Promise<void> {
		const db = await SanctionnedList.findBy<SanctionnedList>({playerid: member.id, bantype: "mute"})
		if (db && db.length !== 0) {
			await member.roles.add(Moderation.getConfiguration().mutedRole);
		}
	}
}
