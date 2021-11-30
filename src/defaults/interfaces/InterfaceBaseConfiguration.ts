import {ColorResolvable, Snowflake} from "discord.js";

export interface InterfaceBaseConfiguration {
    instance: {
        version: string
    }
    defaultEmbed: {
        color: ColorResolvable
        footer: string
    }
    guild: {
        id: Snowflake
        roles: {
            administration: Snowflake[]
            moderation: Snowflake[]
        }
    }
}