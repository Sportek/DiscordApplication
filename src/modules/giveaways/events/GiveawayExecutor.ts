import { BaseEvent, Event } from "@sportek/core-next-sportek";
import { GiveawayManager } from "App/modules/giveaways/GiveawayManager";
import GiveawayData from "App/modules/giveaways/database/models/GiveawayData";

// @ts-ignore
@Event('fullReady')
export default class GiveawayExecutor implements BaseEvent {
	public async run(args: any): Promise<void> {
		setInterval(async () => {
			const data = await GiveawayData.findAll() as GiveawayData[]
			data.forEach(value => {
				if(value.duration <= Math.floor(Date.now()/1000)){
					GiveawayManager.getInstance().executeGiveaway(value.messageid);
				}
			})
		}, 5000)
	}
}
