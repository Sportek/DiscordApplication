import { BaseEvent, Event } from 'ioc:factory/Core/Event'
import { Interaction } from 'discord.js'
import { Application } from "@sportek/core-next-sportek";

@Event('interactionCreate')
export default class EmitButtonEvents extends BaseEvent {
  public async run (interaction: Interaction): Promise<void> {
    if(!interaction.isButton()) return;
    Application.getClient().emit(`buttonInteraction::${interaction.customId}`, {
      buttonInteraction: interaction
    })

  }
}