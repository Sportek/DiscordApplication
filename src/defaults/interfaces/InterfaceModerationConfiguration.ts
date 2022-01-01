import { Snowflake } from "discord.js";

export interface InterfaceModerationConfiguration {
  mutedRole: Snowflake
  lockMuted: Snowflake[]
  channelModerationLogs: Snowflake

  automaticSanctions: {
    maxWarnings: number,
    noLinks: {
      enable: boolean,
      allowedLinks: string[]
    },
    spamTagWave: {
      enable: boolean
    }
    ghostTags:{
      enable: boolean
    }
  }

  staffUpdater: {
    headstaff: Snowflake[]
    staff: Snowflake[]
  }
}