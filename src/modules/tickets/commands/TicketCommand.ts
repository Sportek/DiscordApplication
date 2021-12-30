import { BaseCommand, Command } from 'ioc:factory/Core/Command'
import { CommandInteraction, GuildMember, MessageActionRow, MessageButton, TextChannel } from 'discord.js'
import { getDefaultEmbed, sendEphemeralMessage } from "App/defaults/MessageManager";
import { getCommandPermission, hasMinimumRoleRequired } from "App/defaults/PermissionManager";
import { TicketManager } from "App/modules/tickets/TicketManager";
import { ConfigManager } from "App/defaults/ConfigManager";
import TicketData from "App/modules/tickets/database/models/TicketData";
import { TicketLogManager } from "App/modules/tickets/TicketLogManager";

@Command({
  scope: 'GUILDS',
  permissions: getCommandPermission("modération"),
  options: {
    name: "ticket",
    description: "Permet de gérer les tickets.",
    options: [
      {
        name: 'add',
        description: "Permet d'ajouter un utilisateur au ticket.",
        type: "SUB_COMMAND",
        options: [{name: "utilisateur", description: "Utilisateur ciblé.", required: true, type: "USER"}]
      },
      {
        name: "remove",
        description: "Permet de retirer un utilisateur du ticket.",
        type: "SUB_COMMAND",
        options: [{name: "utilisateur", description: "Utilisateur ciblé.", required: true, type: "USER"}]
      },
      {
        name: "close",
        description: "Permet de fermer un ticket.",
        type: "SUB_COMMAND"
      },
      {
        name: "setup",
        description: "Permet de mettre en place le système de ticket.",
        type: "SUB_COMMAND"
      },
      {
        name: "sync",
        description: "Permet d'ajouter un ticket à la base de donnée.",
        type: "SUB_COMMAND",
        options: [
          {
            name: "user",
            description: "Utilisateur ajouté en tant que propriétaire du ticket.",
            type: "USER",
            required: true
          }
        ]
      }
    ]
  }
})
export default class TicketCommand extends BaseCommand {
  public async run(interaction: CommandInteraction): Promise<void> {
    const member = interaction.member as GuildMember;
    const channel = interaction.channel! as TextChannel;
    if(interaction.options.getSubcommand() === "add") {
      const editedMember = interaction.options.getMember("utilisateur")! as GuildMember;
      if(!await TicketManager.isTicketChannel(channel)) {
        await sendEphemeralMessage(interaction, "Vous ne pouvez pas effectuer cette commande dans ce salon.", false)
        return;
      }
      await channel.permissionOverwrites.edit(editedMember.id, {VIEW_CHANNEL: true})
      const embed = getDefaultEmbed("Tickets")
        .setDescription(`${ editedMember } a été ajouté au ticket. \`✅\``)
      await interaction.reply({embeds: [embed]})
      return;
    }

    if(interaction.options.getSubcommand() === "remove") {
      const editedMember = interaction.options.getMember("utilisateur")! as GuildMember;
      if(!await TicketManager.isTicketChannel(channel)) {
        await sendEphemeralMessage(interaction, "Vous ne pouvez pas effectuer cette commande dans ce salon.", false)
        return;
      }
      await channel.permissionOverwrites.edit(editedMember.id, {VIEW_CHANNEL: false})
      const embed = getDefaultEmbed("Tickets")
        .setDescription(`${ editedMember } a été retiré du ticket. \`✅\``)
      await interaction.reply({embeds: [embed]})
      return;
    }

    if(interaction.options.getSubcommand() === "setup") {
      if(!hasMinimumRoleRequired(member, ConfigManager.getBaseConfiguration().guild.roles.administration)) {
        await sendEphemeralMessage(interaction, "Vous n'avez pas les rôles suffisant pour effectuer cette commande.", false);
        return;
      }
      const embed = getDefaultEmbed("Tickets");
      if(ConfigManager.getTicketConfiguration().ticketSetup.title) embed.setTitle(ConfigManager.getTicketConfiguration().ticketSetup.title)
      embed.setDescription(ConfigManager.getTicketConfiguration().ticketSetup.description);

      const rowButton = new MessageActionRow().addComponents(
        ConfigManager.getTicketConfiguration().ticketTypes.map(function (value) {
          return new MessageButton()
            .setEmoji(value.emoji)
            .setCustomId(value.name)
            .setLabel(value.name)
            .setStyle("SECONDARY")
        })
      )

      await channel.send({embeds: [embed], components: [rowButton]});
      await sendEphemeralMessage(interaction, "Système de prise de commande activé.", true)
      return;
    }

    if(interaction.options.getSubcommand() === "close") {
      if(!await TicketManager.isTicketChannel(channel)) {
        await sendEphemeralMessage(interaction, "Vous ne pouvez pas effectuer cette commande dans ce salon.", false)
        return;
      }

      const ticket = new TicketLogManager(channel, member);
      await ticket.generateLogFile();
      await ticket.removeFile()
      const data = await TicketData.findBy<TicketData>({channelid: channel.id});
      await data.delete()
      await channel.delete()
      return;
    }

    if(interaction.options.getSubcommand() === "sync") {
      if(!hasMinimumRoleRequired(member, ConfigManager.getBaseConfiguration().guild.roles.administration)) {
        await sendEphemeralMessage(interaction, "Vous n'avez pas les rôles suffisant pour effectuer cette commande.", false);
        return;
      }

      const data = await TicketData.findBy({channelid: channel.id}) as TicketData;
      const target = interaction.options.getMember("user") as GuildMember;
      if(data) {
        await sendEphemeralMessage(interaction, "Ce channel est déjà enregistré dans la base de donnée.", false);
        return;
      } else {
        await TicketData.create({
          userid: target.id,
          channelid: channel.id
        })
        await sendEphemeralMessage(interaction, "Vous venez d'enregistrer ce ticket dans la base de donnée.", true);
        return;
      }
    }
  }
}