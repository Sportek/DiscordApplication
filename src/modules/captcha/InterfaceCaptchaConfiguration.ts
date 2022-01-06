import { Snowflake } from "discord.js";

export interface InterfaceCaptchaConfiguration {
  restrictingRole: Snowflake
  channelID: Snowflake
  logsID: Snowflake
}