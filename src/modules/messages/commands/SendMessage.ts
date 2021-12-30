import { BaseCommand, Command } from 'ioc:factory/Core/Command'
import { CommandInteraction, TextChannel } from 'discord.js'
import { sendEphemeralMessage } from "App/defaults/MessageManager";
import Logger from "@leadcodedev/logger";
import { getCommandPermission } from "App/defaults/PermissionManager";
import { ManageEditableMessage } from "App/modules/messages/ManageEditableMessage";
import MessageCache from "App/modules/messages/database/models/MessageCache";
import { ConfigManager } from "App/defaults/ConfigManager";

@Command({
  scope: [ConfigManager.getBaseConfiguration().guild.id],
  permissions: getCommandPermission("administration"),
  options: {
    name: 'send',
    description: "Envoie d'un message embed ou normal.",
    options: [
      {
        name: "messageid",
        description: "Identifiant du message à envoyer.",
        type: "STRING",
        required: true
      },
      {
        name: "channel",
        description: "Channel destinataire du message.",
        type: "CHANNEL",
        channelTypes: ["GUILD_TEXT", "GUILD_NEWS"],
        required: true
      },
      {
        name: "embed",
        description: "Définit si c'est un message embed.",
        type: "BOOLEAN",
        required: true
      },
      {
        name: "title",
        description: "Titre du message dans le cas où c'est un embed.",
        type: "STRING",
        required: false
      }
    ]
  }
})
export default class SendMessage extends BaseCommand {
  public async run(interaction: CommandInteraction): Promise<void> {
    try {
      let channel = interaction.options.getChannel("channel")! as TextChannel
      const title = interaction.options.getString("title");
      const messageid = interaction.options.getString("messageid")!
      const embed = interaction.options.getBoolean("embed")!
      const message = await interaction.channel!.messages.fetch(messageid);
      if(!message) {
        await sendEphemeralMessage(interaction, "Impossible de trouver le message, sélectionnez un message dans le channel lié à la commande. `❌`", false);
        return;
      }

      const newMessage = await channel.send(new ManageEditableMessage().getMessageContent(embed, title, message))

      await sendEphemeralMessage(interaction, "Vous avez bien envoyé votre message `✅`", true)

      await MessageCache.create({
        title: title,
        playermessageid: messageid,
        botmessageid: newMessage.id,
        botchannelid: channel.id,
        playerchannelid: interaction.channel!.id,
        embed: embed
      })
    } catch (e) {
      Logger.send("error", "Une erreur est survenue lors de l'envoie du message. `😥`" + e)
      await sendEphemeralMessage(interaction, "Une erreur est survenue lors de l'envoie du message. `❌`", false)
    }
  }
}