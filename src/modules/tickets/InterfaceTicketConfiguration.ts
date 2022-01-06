import { Snowflake } from "discord.js";

export interface InterfaceTicketConfiguration {

  ticketSetup: {
    title: string,
    description: string
  }
  ticketLogsChannel: Snowflake
  ticketTypes: {
    name: string,
    emoji: string,
    categorie: number,
    tag: string,
    supports: string[]
    tagSupports: boolean
    firstMessage: {
      embed: string,
      message: string
    }
  }[]
  categories: string[]
}