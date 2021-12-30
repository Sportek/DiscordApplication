import {CommandInteraction} from 'discord.js'
import { BaseCommand, Command } from "@sportek/core-next-sportek";
import { ConfigManager } from "App/defaults/ConfigManager";
import { getCommandPermission } from "App/defaults/PermissionManager";
import { SanctionsManager } from "App/modules/moderation/SanctionsManager";

@Command({
    scope: [ConfigManager.getBaseConfiguration().guild.id],
    permissions: getCommandPermission("modération"),
    options: {
        name: 'ban',
        description: 'Permet de bannir un utilisateur de façon temporaire',
        options: [{
            name: 'utilisateur',
            type: 'USER',
            required: true,
            description: 'Utilisateur qui sera banni.',
        },
            {
                name: 'durée',
                description: "Durée de la sanction.",
                type: 'NUMBER',
                required: true,
                choices: [
                    {
                        name: '5 minutes',
                        value: 5 * 60 * 1000,
                    },
                    {
                        name: '15 minutes',
                        value: 15 * 60 * 1000,
                    },
                    {
                        name: '30 minutes',
                        value: 30 * 60 * 1000,
                    },
                    {
                        name: '1 heure',
                        value: 60 * 60 * 1000,
                    },
                    {
                        name: '10 heures',
                        value: 10 * 60 * 60 * 1000,
                    },
                    {
                        name: '1 jour',
                        value: 24 * 60 * 60 * 1000,
                    },
                    {
                        name: '3 jours',
                        value: 3 * 10 * 60 * 60 * 1000,
                    },
                    {
                        name: '7 jours',
                        value: 7 * 10 * 60 * 60 * 1000,
                    },
                    {
                        name: '2 semaines',
                        value: 14 * 10 * 60 * 60 * 1000,
                    },
                    {
                        name: '1 mois',
                        value: 30 * 10 * 60 * 60 * 1000,
                    },
                    {
                        name: '3 mois',
                        value: 90 * 10 * 60 * 60 * 1000,
                    },
                    {
                        name: 'Définitivement',
                        value: 3 * 365 * 10 * 60 * 60 * 1000,
                    },
                ],
            },
            {
                name: 'raison',
                type: 'STRING',
                required: true,
                description: 'Raison de la sanction.',
            }],
    },
})
export default class Ban extends BaseCommand {
    // @ts-ignore
    public async run(interaction: CommandInteraction): Promise<void> {
        await new SanctionsManager(interaction).execute("ban");
    }
}
