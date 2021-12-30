
import {CommandInteraction, TextChannel} from 'discord.js'
import { Application, BaseCommand, Command } from "@sportek/core-next-sportek";
import { ConfigManager } from "App/defaults/ConfigManager";
import { getCommandPermission } from "App/defaults/PermissionManager";
import { UpdateStaffMessage } from "App/modules/moderation/UpdateStaffMessage";
import { sendEphemeralMessage } from "App/defaults/MessageManager";
import MessageUpdate from "App/defaults/database/models/MessageUpdate";


@Command({
    scope: [ConfigManager.getBaseConfiguration().guild.id],
    permissions: getCommandPermission("administration"),
    options: {
        name: 'staff',
        description: 'Permet de gérer le message de staff automatique.',
        options: [
            {
                name: "setup",
                type: "SUB_COMMAND",
                description: "Permet de setup les messages automatiques.",
            },
            {
                name: "update",
                type: "SUB_COMMAND",
                description: "Permet d'update le message automatique."
            }
        ],
    },
})
export default class Staff extends BaseCommand {
    // @ts-ignore
    public async run(interaction: CommandInteraction): Promise<void> {

        if (interaction.options.getSubcommand()=== "setup") {
            const channel = interaction.channel as TextChannel;
            const message = await channel.send({embeds: [await new UpdateStaffMessage().updateMessage(channel.guild)]});
            const oldData = await MessageUpdate.where<MessageUpdate>( "messagetype", "staff");
            for (const value of oldData) {
                await value.delete();
            }

            await MessageUpdate.create({
                messageid: message.id,
                channelid: channel.id,
                messagetype: "staff"
            });
            await sendEphemeralMessage(interaction, "Le message de staff a été mis en place.", true);
            return;
        }
        if (interaction.options.getSubcommand()=== "update") {
            const oldData = await MessageUpdate.findBy<MessageUpdate>( {messagetype: "staff"});
            if(oldData){
                const channel = await Application.getClient()?.channels.fetch(oldData.channelid) as unknown as TextChannel;
                const message = await channel.messages.fetch(oldData.messageid);
                await message.edit({embeds: [await new UpdateStaffMessage().updateMessage(channel.guild)]});
                await sendEphemeralMessage(interaction, "Le message a été update.", true);
                return;
            }
            await sendEphemeralMessage(interaction, "Une erreur est survenue.", false);
            return;
        }
    }
}
