import { Application, BaseEvent, Event } from "@sportek/core-next-sportek";
import { ConfigManager } from "App/defaults/ConfigManager";
import Logger from "@leadcodedev/logger";
import SanctionnedList from "App/modules/moderation/database/models/SanctionnedList";
import { Moderation } from "App/modules/moderation/Moderation";


// @ts-ignore
@Event('fullReady')
export default class SanctionRemover implements BaseEvent {
	public async run(args: any): Promise<void> {
		setInterval(async () => {
			const data = await SanctionnedList.findAll<SanctionnedList>()
			for (const value of data) {
				if (!(value.debandate < Date.now())) continue;
				const guild = Application.getClient()!.guilds.resolve(ConfigManager.getBaseConfiguration().guild.id);
				const member = guild!.members.resolve(value.playerid);
				const muteRole = guild!.roles.resolve(Moderation.getConfiguration().mutedRole);
				if (!member) continue;
				if (!muteRole) continue;
				if (!guild) continue;
				switch (value.bantype) {
					case "ban":
						try {
							await guild.bans.remove(member, "Débannissement automatique");
							Logger.send("success",`${member.displayName} a été débannis.`)
						} catch (e) {
							Logger.send("error", `Une erreur est survenue (SanctionRemover.ts) ${e}`);
						}
						break;
					case "mute":
						try {
							await member.roles.remove(muteRole, "Retrait automatique")
							Logger.send("success",`${member.displayName} a de nouveau accès au chat.`)
						} catch (e) {
							Logger.send("error", `Une erreur est survenue (SanctionRemover.ts) ${e}`);
						}
						break;
					default:
						continue;
				}

				await value.delete()

			}
		}, 10000);
	}
}
