import { ButtonInteraction, CommandInteraction, ContextMenuInteraction, MessageEmbed } from "discord.js";
import { ConfigManager } from "App/defaults/ConfigManager";
import { Application } from "@sportek/core-next-sportek";
import { Colors } from "@discord-factory/colorize";
import { MessageConfigure } from "App/defaults/MessageConfigure";

type EmbedType = "Utilitaires" | "Tickets" | "Invitations" | "Sanctions" | "Giveaways" | "Confirmation" | "Niveaux"

export function getDefaultEmbed(utility: EmbedType) {
  const embed = new MessageEmbed();
  embed.setTimestamp()
  // @ts-ignore
  embed.setColor(getColors())
  embed.setFooter(`${ ConfigManager.getBaseConfiguration().defaultEmbed.footer } • ${ utility }`, Application.getClient()!.user?.avatarURL()!);
  return embed;
}

export function getColors() {
  // @ts-ignore
  return ConfigManager.getBaseConfiguration().defaultEmbed.color === "invisible" ? Colors.INVISIBLE : ConfigManager.getBaseConfiguration().defaultEmbed.color
}

export async function sendEphemeralMessage(interaction: CommandInteraction | ButtonInteraction | ContextMenuInteraction, message: string | MessageConfigure, status: boolean) {

  if(typeof message !== "string") {
    return;
  }

  const embed = getDefaultEmbed("Confirmation")
    .setAuthor(status ? "Succès": "Commande incorrecte", status? "https://cdn.discordapp.com/emojis/821329948634644481.png?size=128": "https://cdn.discordapp.com/emojis/821329948903997440.png?size=128")
    .setDescription(message);
  status ? embed.setColor("#43B581") : embed.setColor("#F04747");
  await interaction.reply({embeds: [embed], ephemeral: true});
}