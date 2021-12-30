import {Interaction} from "discord.js";
import { GiveawayManager } from "App/modules/giveaways/GiveawayManager";
import { BaseEvent, Event } from "@sportek/core-next-sportek";

@Event('interactionCreate')
export default class GiveawayParticipation implements BaseEvent {
	public async run(interaction: Interaction): Promise<void> {
		if(!interaction.isButton()) return;
		if(interaction.customId === "giveaway"){
			await GiveawayManager.getInstance().addParticipation(interaction);
		}
	}
}
