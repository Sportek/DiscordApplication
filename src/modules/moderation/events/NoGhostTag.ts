import { Message } from "discord.js";
import { BaseEvent, Event } from "@sportek/core-next-sportek";
import { ConfigManager } from "App/defaults/ConfigManager";
import { WarningCollection } from "App/modules/moderation/collections/WarningCollection";
import { Moderation } from "App/modules/moderation/Moderation";


@Event('messageCreate')
export default class NoGhostTag implements BaseEvent {
	public async run(message: Message): Promise<void> {
		if(!Moderation.getConfiguration().automaticSanctions.ghostTags.enable) return;
		if(message.channel.type === "DM") return;
		if(!message.mentions.users.first()) return;
		if(message.author.bot) return;
		if(message.member!.roles.cache.some(r => ConfigManager.getBaseConfiguration().guild.roles.administration.includes(r.id))) return;
		setTimeout(async () => {
			if (message.deleted) {
				await WarningCollection.getInstance().addWarning(message.member!, message, "Ghost ping");
			}
		}, 10000)
	}
}
