import {
  ButtonInteraction,
  CommandInteraction,
  ContextMenuInteraction,
  GuildMember,
  MessageEmbed,
  MessageOptions,
  MessagePayload
} from "discord.js";
import { ConfigManager } from "App/defaults/ConfigManager";
import { Application } from "@sportek/core-next-sportek";
import { Colors } from "@discord-factory/colorize";
import { MessageConfigure } from "App/defaults/MessageConfigure";
import Logger from "@leadcodedev/logger";

type EmbedType = "Utilitaires" | "Tickets" | "Invitations" | "Sanctions" | "Giveaways" | "Confirmation" | "Niveaux" | "Vocaux temporaires" | "Captcha"

export function getDefaultEmbed(utility: EmbedType) {
  const embed = new MessageEmbed();
  embed.setTimestamp()
  // @ts-ignore
  embed.setColor(getColors())
  embed.setFooter(`${ ConfigManager.getBaseConfiguration().defaultEmbed.footer } • ${ utility }`, Application.getClient()!.user?.avatarURL()!);
  return embed;
}

export async function sendPrivateConfirmation(member : GuildMember, message: string, status: boolean) {
  return sendPrivateMessage(member, {embeds: [getConfirmationEmbed(status).setDescription(message)]})
}

export async function sendPrivateMessage(member: GuildMember, message: string | MessagePayload | MessageOptions) {
  try {
    const channel = await member.createDM(true);
    await channel.send(message);
  } catch (e) {
    Logger.send("error", `Impossible d'envoyer des messages privés à ${ member.displayName }.`);
  }
}

function getConfirmationEmbed(status: boolean) {
  return getDefaultEmbed("Confirmation")
    .setAuthor(status ? "Succès" : "Commande incorrecte", status ? "https://cdn.discordapp.com/emojis/821329948634644481.png?size=128" : "https://cdn.discordapp.com/emojis/821329948903997440.png?size=128")
    .setColor(status ? "#43B581" : "#F04747");
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
    .setAuthor(status ? "Succès" : "Commande incorrecte", status ? "https://cdn.discordapp.com/emojis/821329948634644481.png?size=128" : "https://cdn.discordapp.com/emojis/821329948903997440.png?size=128")
    .setDescription(message);
  status ? embed.setColor("#43B581") : embed.setColor("#F04747");
  await interaction.reply({embeds: [embed], ephemeral: true});
}

export async function sendDeferredMessage(interaction: CommandInteraction | ButtonInteraction | ContextMenuInteraction, message: string, status: boolean) {

  const embed = getDefaultEmbed("Confirmation")
    .setAuthor(status ? "Succès" : "Commande incorrecte", status ? "https://cdn.discordapp.com/emojis/821329948634644481.png?size=128" : "https://cdn.discordapp.com/emojis/821329948903997440.png?size=128")
    .setDescription(message);
  status ? embed.setColor("#43B581") : embed.setColor("#F04747");
  await interaction.editReply({embeds: [embed]});
}
