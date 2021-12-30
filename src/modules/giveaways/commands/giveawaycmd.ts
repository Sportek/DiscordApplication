import { CommandInteraction, MessageActionRow, MessageButton, TextChannel, User } from 'discord.js'
import { Application, BaseCommand, Command } from "@sportek/core-next-sportek";
import { getCommandPermission } from "App/defaults/PermissionManager";
import { GiveawayManager } from "App/modules/giveaways/GiveawayManager";
import { getDefaultEmbed, sendEphemeralMessage } from "App/defaults/MessageManager";
import { Giveaway } from "App/modules/giveaways/Giveaway";
import { ConfigManager } from "App/defaults/ConfigManager";
import { getRandomInt } from "App/defaults/MathUtils";
import Logger from "@leadcodedev/logger";


@Command({
  scope: [ConfigManager.getBaseConfiguration().guild.id],
  permissions: getCommandPermission("administration"),
  options: {
    name: 'giveaway',
    description: 'Permet de gérer les giveaways',
    options: [
      {
        name: "add",
        type: "SUB_COMMAND",
        description: "Permet de démarrer un giveaway.",
        options: [{
          name: 'durée',
          description: "Durée du giveaway.",
          type: 'NUMBER',
          required: true,
          choices: [
            {
              name: '1 minute',
              value: 60 * 1000,
            },
            {
              name: '1 heure',
              value: 60 * 60 * 1000,
            },
            {
              name: '2 heures',
              value: 2 * 60 * 60 * 1000,
            },
            {
              name: '3 heures',
              value: 3 * 60 * 60 * 1000,
            },
            {
              name: '5 heures',
              value: 5 * 60 * 60 * 1000,
            },
            {
              name: '10 heures',
              value: 10 * 60 * 60 * 1000,
            },
            {
              name: '20 heures',
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
          ],
        },
          {
            name: "gagnants",
            type: "NUMBER",
            required: true,
            description: "Nombre de gagnants."
          },
          {
            name: "récompense",
            description: "Récompense pour chaque gagnants (séparer chaque lot avec \", \").",
            type: "STRING",
            required: true,
          },
          {
            name: "invite",
            description: "Minimum invites to participate.",
            type: "NUMBER",
            required: false
          }]
      },
      {
        name: "message",
        type: "SUB_COMMAND",
        description: "Permet de lancer un giveaway à l'aide d'un message.",
        options: [{
          name: "messageid",
          type: "STRING",
          required: true,
          description: "Identifiant du message pour lequel faire un giveaway."
        },
          {
            name: "number",
            type: "NUMBER",
            required: false,
            description: "Nombre de gagnants."
          }]
      }
    ],
  },
})
export default class Giveawaycmd extends BaseCommand {
  public async run(interaction: CommandInteraction): Promise<void> {
    if(interaction.options.getSubcommand() === "add") {
      const winners = interaction.options.getNumber("gagnants")!
      const rewards = interaction.options.getString("récompense")!
      const duration = interaction.options.getNumber("durée")!
      const giveawayManager = GiveawayManager.getInstance();
      const endTimestamp = Math.floor((Date.now() + duration) / 1000)
      const invite = interaction.options.getNumber("invite")

      const rewardFormated = giveawayManager.formatRewards(rewards)
      const embed = getDefaultEmbed("Giveaways")
        .setTitle("GIVEAWAY")
        .setDescription(`\`\`\`Prix: ${ rewardFormated } \`\`\`\n**Informations:**\nCréateur: ${ interaction.member! }\nNombre de gagnants: ${ winners }\nFin: <t:${ endTimestamp }:R>\nNombre de participant(s): 0\n${ (invite) ? `\n**Requis:**\n ${ invite ? `\n\`🔖\` Nombre d'invitation(s) minimal: **${ invite }**` : "" }` : "" }\n**Comment participer?**\nPour participer, vous devez appuyez sur le bouton et ne pas quitter le discord avant la fin du giveaway.`);

      const button = new MessageActionRow()
        .addComponents(new MessageButton()
          .setCustomId("giveaway")
          .setEmoji("🎟")
          .setLabel("Cliquez pour participer")
          .setStyle("SUCCESS"))

      const message = await interaction.channel!.send({embeds: [embed], components: [button]});
      const giveaway = new Giveaway(message, rewards, winners, endTimestamp, interaction.user.id, invite, null);
      await GiveawayManager.getInstance().createGiveaway(giveaway)
      await sendEphemeralMessage(interaction, "Le giveaway a bien été lancé.", true);
    }

    if(interaction.options.getSubcommand() === "message") {
      let number = interaction.options.getNumber("number") || 1;
      const channel = interaction.channel! as TextChannel;
      const message = await channel.messages.fetch(interaction.options.getString("messageid")!);
      if(!message) {
        await sendEphemeralMessage(interaction, "Impossible de récupérer le message concerné.", false);
        return;
      }


      const reaction = message.reactions.cache
      const users: User[] = [];
      for (const value of reaction) {
        const participations = await value[1].users.fetch()
        participations.forEach(value1 => {
          users.push(value1)
        })
      }

      if(!users || users.length === 0) {
        await sendEphemeralMessage(interaction, "Aucune réaction au message.", false);
        return;
      }

      if(users.length < number) number = users.length;


      const winners: User[] = []

      const discordMembers = await Application.getClient().guilds.resolve(ConfigManager.getBaseConfiguration().guild.id)?.members.fetch()

      while (winners.length !== number) {

        let selectWinner;

        do {
          const winnerNumber = getRandomInt(users.length)
          if(!discordMembers!.has(users[winnerNumber].id)){
            Logger.send("warn", `${users[winnerNumber].tag} n'est plus dans le discord, il a donc été retiré du giveaway.`)
          }
          if(discordMembers!.has(users[winnerNumber].id) && !winners.includes(selectWinner)) selectWinner = users[winnerNumber];
        } while (!selectWinner);

        winners.push(selectWinner);

      }

      console.log("Winners: " + winners)

      const embed = getDefaultEmbed("Giveaways")
        .setTitle(`GIVEAWAY`)
        .setDescription(`Le(s) gagnant(s) du [giveaway](${ message.url }) a/ont été sélectionnée(s). Félicitations au(x) gagnant(s): \n${ winners.map(value => {
          return `- ${ value } (${ value.tag })`
        }).join("\n")}`)

      await interaction.reply({embeds: [embed]});
    }
  }
}
