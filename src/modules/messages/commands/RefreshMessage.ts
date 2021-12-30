import { BaseContextMenu, ContextMenu } from "@sportek/core-next-sportek"
import { ContextMenuInteraction, TextChannel } from 'discord.js'
import { sendEphemeralMessage } from "App/defaults/MessageManager";
import { Application } from "@sportek/core-next-sportek";
import { getCommandPermission } from "App/defaults/PermissionManager";
import { ManageEditableMessage } from "App/modules/messages/ManageEditableMessage";
import MessageCache from "App/modules/messages/database/models/MessageCache";
import { ConfigManager } from "App/defaults/ConfigManager";

@ContextMenu({
  permissions: getCommandPermission("administration"),
  scope: [ConfigManager.getBaseConfiguration().guild.id],
  options: {
    name: 'refresh-message',
    type: 'MESSAGE'
  }
})
export default class RefreshMessage extends BaseContextMenu {
  public async run(interaction: ContextMenuInteraction): Promise<void> {

    const message = interaction.targetId
    const data = await MessageCache.findBy<MessageCache>("playermessageid", message);

    if(data) {
      const playerChannel = await Application.getClient().channels.fetch(data.playerchannelid) as unknown as TextChannel;
      const playerMessage = await playerChannel.messages.fetch(data.playermessageid);
      const botChannel = await Application.getClient().channels.fetch(data.botchannelid) as unknown as TextChannel;
      const botMessage = await botChannel.messages.fetch(data.botmessageid);

      const test = new ManageEditableMessage().getMessageContent(data.embed, data.title, playerMessage);
      await botMessage.edit(test);
      await sendEphemeralMessage(interaction, "Le message a été édit! `✅`", true);

    } else {
      await sendEphemeralMessage(interaction, "Impossible d'update ce message. `😥`", false)
    }
  }
}