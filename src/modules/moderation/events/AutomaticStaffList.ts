
import {TextChannel} from "discord.js";
import { Application, BaseEvent, Event } from "@sportek/core-next-sportek";
import { UpdateStaffMessage } from "App/modules/moderation/UpdateStaffMessage";
import MessageUpdate from "App/defaults/database/models/MessageUpdate";

// @ts-ignore
@Event('fullReady')
export default class AutomaticStaffList implements BaseEvent {
  public async run(client: any): Promise<void> {
    setInterval(async () => {
      const oldData = await MessageUpdate.findBy<MessageUpdate>( {messagetype: "staff"});
      if (oldData) {
        const channel = await Application.getClient()?.channels.fetch(oldData.channelid) as unknown as TextChannel;
        const message = await channel.messages.fetch(oldData.messageid);
        await message.edit({embeds: [await new UpdateStaffMessage().updateMessage(channel.guild)]});
        return;
      }
    }, 5*60*60*1000)
  }
}
