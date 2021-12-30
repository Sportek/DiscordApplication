import { BaseEvent, Event } from 'ioc:factory/Core/Event'
import { Interaction } from 'discord.js'
import { TicketManager } from "App/modules/tickets/TicketManager";

@Event('interactionCreate')
export default class CreateNewTicket extends BaseEvent {
    public async run(interaction: Interaction): Promise<void> {
        if(!interaction.isButton()) return;
        await TicketManager.createTicket(interaction)
    }
}