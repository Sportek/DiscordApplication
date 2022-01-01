import { Event, BaseEvent } from 'ioc:factory/Core/Event'
import { Message } from 'discord.js'
import { getDefaultEmbed } from "App/defaults/MessageManager";
import { ConfigManager } from "App/defaults/ConfigManager";
import { Application } from "@sportek/core-next-sportek";

@Event('messageCreate')
export default class SuggestionCreate extends BaseEvent {
  public async run (message: Message): Promise<void> {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (message.channelId !== ConfigManager.getBaseConfiguration().suggestions.channel) return;

    const embed = getDefaultEmbed("Utilitaires")
      .setTitle(`${Application.getClient().user!.username} ➜ Suggestion`)
      .setDescription(`**Auteur:** ${message.author.tag}\n\n\`📝\` ${message}`)

    const deliveryMessage = await message.channel.send({embeds: [embed]});
    deliveryMessage.react("✅");
    deliveryMessage.react("❌");
    await deliveryMessage.startThread({name: `Avis sur la suggestion ${deliveryMessage.id}`, autoArchiveDuration: 1440})
    await message.delete();
  }
}