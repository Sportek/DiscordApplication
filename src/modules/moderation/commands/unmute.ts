
import {CommandInteraction, GuildMember} from 'discord.js'
import { BaseCommand, Command } from "@sportek/core-next-sportek";
import { ConfigManager } from "App/defaults/ConfigManager";
import { getCommandPermission } from "App/defaults/PermissionManager";
import { sendEphemeralMessage } from "App/defaults/MessageManager";
import Logger from "@leadcodedev/logger";
import SanctionnedList from "App/modules/moderation/database/models/SanctionnedList";
import { Moderation } from "App/modules/moderation/Moderation";


@Command({
    scope: [ConfigManager.getBaseConfiguration().guild.id],
    permissions: getCommandPermission("modération"),
    options: {
        name: 'unmute',
        description: 'Permet de rendre la parole a un utilisateur.',
        options: [
            {
                name: 'utilisateur',
                type: "USER",
                required: true,
                description: "Permet de rendre le droit de parole à un utilisateur.",
            },
        ],
    },
})
export default class Unmute extends BaseCommand {
    // @ts-ignore
    public async run(interaction: CommandInteraction): Promise<void> {
        const guild = interaction.guild;
        const member = interaction.options.getMember("utilisateur")! as GuildMember;
        if (!member.roles.cache.has(Moderation.getConfiguration().mutedRole)) {
            await sendEphemeralMessage(interaction, "Cet utilisateur n'est actuellement pas réduit au silence.", false)
            return;
        }

        try {
            await member.roles.remove(Moderation.getConfiguration().mutedRole);
            const sanction = await SanctionnedList.where<SanctionnedList>({playerid: member.id, bantype: "mute"})
            for (const value of sanction) {
                await value.delete();
            }

            await sendEphemeralMessage(interaction, `Vous avez rendu la parole à ${member}`, true);
        } catch (e) {
            await sendEphemeralMessage(interaction, "Impossible de rendre la parole à cet utilisateur.", false)
            Logger.send("error", `Une erreur est survenue lors de la tentative de retrait du rôle de ${member.displayName}: ${e}`);
        }
    }
}
