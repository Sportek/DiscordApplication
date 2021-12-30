import { BaseEvent, Event } from 'ioc:factory/Core/Event'
import { DMChannel, GuildChannel } from "discord.js";
import Logger from "@leadcodedev/logger";
import TicketData from "App/modules/tickets/database/models/TicketData";

@Event('channelDelete')
export default class RemoveWhenChannelDeleted extends BaseEvent {
  public async run (channel: DMChannel | GuildChannel): Promise<void> {
    if(channel instanceof DMChannel) return;
    const channelid = channel.id
    const data = await TicketData.findBy<TicketData>("channelid", channelid)
    if(data) {
      await data.delete();
      Logger.send("success", `Suppression du channel de ticket ${channel.name} avec succès.`)
    }
  }
}