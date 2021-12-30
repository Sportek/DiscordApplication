import {GuildBan} from "discord.js";
import { BaseEvent, Event } from "@sportek/core-next-sportek";
import SanctionnedList from "App/modules/moderation/database/models/SanctionnedList";
import Logger from "@leadcodedev/logger";

@Event('guildBanRemove')
export default class ModeratorRemoveBan implements BaseEvent {
	public async run(ban: GuildBan): Promise<void> {
		try {
			const db = await SanctionnedList.where<SanctionnedList>({playerid: ban.user.id, banType: "ban"});
			for (const value of db) {
				await value.delete();
			}
		} catch (e) {
			Logger.send("error", ""+e)
		}
	}
}
