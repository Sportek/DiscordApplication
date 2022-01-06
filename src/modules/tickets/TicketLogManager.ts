import fs from "fs"
import { GuildMember, TextChannel } from "discord.js";
import TicketData from "App/modules/tickets/database/models/TicketData";
import { Application } from "@sportek/core-next-sportek";
import { convertTimestampToDate, getFormatedTimeFromSeconds } from "App/defaults/TimeManager";
import { getDefaultEmbed } from "App/defaults/MessageManager";
import Logger from "@leadcodedev/logger";
import { Ticket } from "App/modules/tickets/Ticket";


export class TicketLogManager {
  private readonly channel: TextChannel;
  private readonly name: string;
  private readonly member: GuildMember;

  constructor(channel: TextChannel, member: GuildMember) {
    this.name = channel.name.replace(" ", "_") + ".txt";
    this.channel = channel;
    this.member = member;
  }


  public async generateLogFile() {
    try {
      const ticket = await TicketData.findBy({channelid: this.channel.id}) as TicketData;
      const user = ticket?.userid

      let data = `Ticket de ${ user ? Application.getClient()?.users.resolve(user)?.tag : "Non définit" }. \nOuvert le ${ convertTimestampToDate(this.channel.createdTimestamp) } et fermé le ${ convertTimestampToDate(Date.now()) }.`;
      const messages = await this.channel.messages.fetch();
      messages.sorted((firstValue, secondValue) => firstValue.createdAt.getTime() - secondValue.createdAt.getTime()).forEach(value => {
        if(!value.content) return;
        data += `\n[${ convertTimestampToDate(value.createdTimestamp) }] ${ value.author.tag }: ${ value.content }`
      })
      fs.writeFileSync(this.name, data, 'utf8')


      const moderatorLogger = await Application.getClient().channels.fetch(Ticket.getConfiguration().ticketLogsChannel) as TextChannel
      const embed = getDefaultEmbed("Tickets")
        .setDescription(`Log du ticket de ${ user ? Application.getClient()?.users.resolve(user) : "Non définit" }, fermé par ${ this.member }.\n**⌚ Temps de réponse:** ${ getFormatedTimeFromSeconds(Date.now() / 1000 - this.channel.createdTimestamp / 1000) }`)

      await moderatorLogger.send({embeds: [embed], files: [this.name]});


    } catch (e) {
      Logger.send("error", "Error: " + e)
    }
  }

  public async removeFile() {
    try {
      fs.unlinkSync(this.name);
    } catch (e) {
      Logger.send("error", "Error: " + e)
    }
  }
}