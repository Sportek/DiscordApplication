import {
  ButtonInteraction,
  GuildChannel,
  GuildMember,
  MessageEmbedOptions,
  MessageOptions,
  OverwriteResolvable
} from "discord.js";
import TicketData from "App/modules/tickets/database/models/TicketData";
import { ConfigManager } from "App/defaults/ConfigManager";
import { getColors, sendEphemeralMessage } from "App/defaults/MessageManager";
import { Application } from "@sportek/core-next-sportek";
import { Ticket } from "App/modules/tickets/Ticket";

export class TicketManager {

  public static async isTicketChannel(channel: GuildChannel): Promise<boolean> {
    const data = await TicketData.findBy<TicketData>({channelid: channel.id})
    return !!data;
  }

  public static async createTicket(interaction: ButtonInteraction) {
    const member = interaction.member as GuildMember
    const customID = interaction.customId
    const guild = member.guild;
    const data = this.getConfigData(customID)
    if(!data) return;

    const check = await this.checkIfAlreadyHasTicket(interaction)
    if(check) {
      return;
    }

    let permission: OverwriteResolvable[] = data.supports.map(function (value: string) {
      return {type: "role", id: value, allow: "VIEW_CHANNEL"};
    });
    permission.push({type: "role", id: guild.id, deny: "VIEW_CHANNEL"})
    permission.push({type: "member", id: member.id, allow: "VIEW_CHANNEL"})

    const channel = await guild.channels.create(`${ data.emoji }-${ member.displayName }`, {
      type: "GUILD_TEXT",
      permissionOverwrites: permission,
      parent: Ticket.getConfiguration().categories[data.categorie]
    })

    const embed = data.firstMessage.embed ? [{
      title: `🏷️ Système de support - ${ data.name }`,
      color: getColors(),
      footer: {
        text: ConfigManager.getBaseConfiguration().defaultEmbed.footer,
        iconURL: Application.getClient().user!.avatarURL()
      },
      description: `Bonjour ${ member }, \n` + data.firstMessage.embed
    }] as MessageEmbedOptions[] : undefined


    const createMessage: MessageOptions = {
      embeds: embed,
      content: data.firstMessage.message ? data.firstMessage.message : undefined
    }

    await channel.send(createMessage)
    if(data.tagSupports && data.supports) {
      const tagUsers = data.supports.map(async value => await guild.roles.fetch(value));
      const users = await Promise.all(tagUsers)
      const mess = users.join(", ")
      if(mess) {
        await channel.send(users.join(", "))
      }
    }
    await sendEphemeralMessage(interaction, `Votre ticket a été créé: ${ channel }`, true);
    await TicketData.create<TicketData>({
      userid: member.id,
      channelid: channel.id
    })
  }

  private static getConfigData(customID: string) {
    return Ticket.getConfiguration().ticketTypes.filter(value => value.name === customID)[0]
  }

  private static async checkIfAlreadyHasTicket(interaction: ButtonInteraction): Promise<boolean> {
    const member = interaction.member as GuildMember;

    const data = await TicketData.findBy<TicketData>({userid: member.id}) as TicketData

    if(data) {
      const oldChannel = await Application.getClient().channels.resolve(data.channelid)
      if(!oldChannel) {
        await sendEphemeralMessage(interaction, "Une erreur est survenue, réessayez.", false)
        await data.delete()
        return true;
      }
      await sendEphemeralMessage(interaction, `Vous avez déjà un ticket: ${ oldChannel }. \`😅\``, false)
      return true;
    }
    return false;
  }
}