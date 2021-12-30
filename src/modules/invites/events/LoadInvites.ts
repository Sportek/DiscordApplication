import { Application, BaseEvent, Event } from "@sportek/core-next-sportek";
import { ConfigManager } from "App/defaults/ConfigManager";
import { InviteCollection } from "App/modules/invites/InviteCollection";

// @ts-ignore
@Event('fullReady')
export default class LoadInvites implements BaseEvent {
	public async run(args: any): Promise<void> {
		setTimeout(async () => {

			const guild = await Application.getClient().guilds.fetch(ConfigManager.getBaseConfiguration().guild.id);
			const invites = await guild.invites.fetch();
			// if(guild.vanityURLCode){
			// 	const vanityData = await guild.fetchVanityData()
			// }
			/*
			* TODO Gérer les vanity url
			* */
			InviteCollection.getInstance().defineInvites(invites);

			// Application.getClient()!.guilds.resolve(ConfigManager.getBaseConfiguration().guild.id)?.invites.fetch()!.then(invites => {
			// 	InviteCollection.getInstance().defineInvites(invites);
			// })
		}, 3000)
	}
}
