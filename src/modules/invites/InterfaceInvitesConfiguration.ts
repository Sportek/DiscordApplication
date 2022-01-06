import { Snowflake } from "discord.js";

export interface InterfaceInvitesConfiguration {
  memberLeave: string | undefined
  memberJoin: string | undefined
  channelid: Snowflake
  defaultRole: Snowflake
}