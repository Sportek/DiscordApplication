import { Snowflake } from "discord.js";

export interface InterfaceRankingConfiguration {
  nitroBoost: {
    activate: boolean,
    roleid: Snowflake,
    boost: number
  }

  rewards: {
    level: number,
    roleid: Snowflake
  }[]
}