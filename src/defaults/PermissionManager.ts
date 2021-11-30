import {ConfigManager} from "App/defaults/ConfigManager";
import { GuildMember, Snowflake } from "discord.js";

type Role = "administration" | "modération"
export function getCommandPermission(role: Role) {
    switch (role) {
        case "administration":
            return getPermissionFromConfig(ConfigManager.getBaseConfiguration().guild.roles.administration)
        case "modération":
            return getPermissionFromConfig([...ConfigManager.getBaseConfiguration().guild.roles.administration, ...ConfigManager.getBaseConfiguration().guild.roles.moderation]);
    }
}

function getPermissionFromConfig(config: string[]): {id: string, type: "USER" | "ROLE", permission: boolean}[] {
    return config.map(value => ({
        id: value,
        type: "ROLE",
        permission: true
    }));
}

export function hasMinimumRoleRequired(member: GuildMember, roles: Snowflake[]) : boolean {
    return member.roles.cache.some(r => roles.includes(r.id))
}