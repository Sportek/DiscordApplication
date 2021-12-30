import { Message, PartialMessage } from "discord.js";
import { BaseEvent, Event } from "@sportek/core-next-sportek";
import Logger from "@leadcodedev/logger";
import MessageCache from "App/modules/messages/database/models/MessageCache";


@Event('messageDelete')
export default class DeleteMessageOnDelete extends BaseEvent {
  public async run(message: Message | PartialMessage): Promise<void> {
    const messageid = message.id

    const data = await MessageCache.findBy<MessageCache>("playermessageid", messageid)
    if(data) {
      await data.delete();
      Logger.send("success", `Suppression du message ${data.playermessageid} avec succès.`)
      return;
    }

    const otherData = await MessageCache.findBy<MessageCache>("botmessageid", messageid)
    if(otherData){
      Logger.send("success", `Suppression du message ${data.botmessageid} avec succès.`)
      await otherData.delete();
    }
  }
}