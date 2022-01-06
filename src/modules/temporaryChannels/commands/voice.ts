import { BaseCommand, Command } from 'ioc:factory/Core/Command'
import { CommandInteraction, GuildMember, VoiceChannel } from 'discord.js'
import { ConfigManager } from "App/defaults/ConfigManager";
import {
  getTemporaryChannelByOwner,
  userHasPermissionCommand
} from "App/modules/temporaryChannels/TemporaryChannelManager";
import { sendEphemeralMessage } from "App/defaults/MessageManager";
import Logger from "@leadcodedev/logger";

@Command({
  scope: [ConfigManager.getBaseConfiguration().guild.id],
  options: {
    name: 'voice',
    description: 'Permet de gérer votre salon vocal.',
    options: [{
      name: "blacklist",
      description: "Permet de gérer les joueurs blacklist du salon.",
      type: "SUB_COMMAND_GROUP",
      options: [{
        name: "add",
        description: "Permet d'ajouter quelqu'un à la blacklist.",
        type: "SUB_COMMAND",
        options: [{
          name: "user",
          description: "Utilisateur ajouté à la blacklist.",
          type: "USER",
          required: true
        }]
      },
        {
          name: "remove",
          description: "Permet de retirer quelqu'un de la blacklist.",
          type: "SUB_COMMAND",
          options: [{
            name: "user",
            description: "Utilisateur retiré de la blacklist.",
            type: "USER",
            required: true
          }]

        }]
    },
      {
        name: "whitelist",
        description: "Permet de gérer les joueurs whitelist au salon.",
        type: "SUB_COMMAND_GROUP",
        options: [{
          name: "add",
          description: "Permet d'ajouter quelqu'un à la whitelist.",
          type: "SUB_COMMAND",
          options: [{
            name: "user",
            description: "Utilisateur ajouté à la whitelist.",
            type: "USER",
            required: true
          }]
        },
          {
            name: "remove",
            description: "Permet de retirer quelqu'un de la whitelist.",
            type: "SUB_COMMAND",
            options: [{
              name: "user",
              description: "Utilisateur retiré de la whitelist.",
              type: "USER",
              required: true
            }]
          }]
      },
      {
        name: "manage",
        description: "Permet de gérer le salon.",
        type: "SUB_COMMAND_GROUP",
        options: [{
          name: "change-name",
          type: "SUB_COMMAND",
          description: "Permet de changer le nom du salon.",
          options: [{
            name: "name",
            type: "STRING",
            required: true,
            description: "Nouveau nom du salon."
          }]
        },
          {
            name: "change-type",
            type: "SUB_COMMAND",
            description: "Permet de changer le type de salon.",
            options: [{
              name: "type",
              required: true,
              description: "Nouveau type du salon.",
              type: "STRING",
              choices: [{
                name: "Private",
                value: "PRIVATE"
              }, {
                name: "Public",
                value: "PUBLIC"
              }]
            }]
          }]
      }]
  }
})
export default class Voice extends BaseCommand {
  public async run(interaction: CommandInteraction): Promise<void> {
    try {
      const member = interaction.member! as GuildMember;
      if(!(await userHasPermissionCommand(interaction))) {
        return;
      }

      const channel = await member.guild.channels.fetch((await getTemporaryChannelByOwner(member)).channel_id) as VoiceChannel;

      if(interaction.options.getSubcommandGroup() === "blacklist") {
        const user = interaction.options.getUser("user")!;

        if(interaction.options.getSubcommand() === "add") {
          await channel.permissionOverwrites.edit(user, {CONNECT: false})
          await sendEphemeralMessage(interaction, `Vous avez ajouté ${ user } à la blacklist!`, true)
          return;
        }
        if(interaction.options.getSubcommand() === "remove") {
          await channel.permissionOverwrites.edit(user, {CONNECT: undefined})
          await sendEphemeralMessage(interaction, `Vous avez retiré ${ user } de la blacklist!`, true)
          return;
        }

      }

      if(interaction.options.getSubcommandGroup() === "whitelist") {
        const user = interaction.options.getUser("user")!;

        if(interaction.options.getSubcommand() === "add") {
          await channel.permissionOverwrites.edit(user, {CONNECT: true})
          await sendEphemeralMessage(interaction, `Vous avez ajouté ${ user } à la whitelist!`, true)
          return;
        }
        if(interaction.options.getSubcommand() === "remove") {
          await channel.permissionOverwrites.edit(user, {CONNECT: null})
          await sendEphemeralMessage(interaction, `Vous avez retiré ${ user } de la whitelist!`, true)
          return;
        }
      }

      if(interaction.options.getSubcommandGroup() === "manage") {
        if(interaction.options.getSubcommand() === "change-type") {
          const type = interaction.options.getString("type")!;
          if(type === "PRIVATE") {
            await channel.permissionOverwrites.edit(member.guild.id, {CONNECT: false})
            await sendEphemeralMessage(interaction, `Vous avez passé le salon en mode \`privé\`!`, true)
            return;
          }
          if(type === "PUBLIC") {
            await channel.permissionOverwrites.edit(member.guild.id, {CONNECT: null})
            await sendEphemeralMessage(interaction, `Vous avez passé le salon en mode \`public\`!`, true)
            return;
          }
        }

        if(interaction.options.getSubcommand() === "change-name") {
          const name = interaction.options.getString("name")!;
          if(name.length > 30) {
            await sendEphemeralMessage(interaction, `Ce nom est trop long, prenez en un ne dépassant pas les \`30\` caractères!`, false)
            return;
          }
          await channel.edit({name: `🎧 ${ name }`})
          await sendEphemeralMessage(interaction, `Vous venez de changer le nom de votre salon en ${ name }!`, true)
          return;
        }
      }
    } catch (e) {
      await sendEphemeralMessage(interaction, `Une erreur est subvenue, merci de réessayer.`, false);
      Logger.send("error", "Erreur: "+e)
    }
  }
}