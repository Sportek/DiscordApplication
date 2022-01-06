import {
  ButtonInteraction,
  GuildMember,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Snowflake,
  TextChannel
} from "discord.js";
import { GiveawayObject } from "App/modules/giveaways/GiveawayObject";
import Logger from "@leadcodedev/logger";
import { Application } from "@sportek/core-next-sportek";
import { getDefaultEmbed, sendEphemeralMessage } from "App/defaults/MessageManager";
import { getRandomInt } from "App/defaults/MathUtils";
import GiveawayData from "App/modules/giveaways/database/models/GiveawayData";
import GiveawayNow from "App/modules/giveaways/database/models/GiveawayNow";
import InvitesData from "App/modules/invites/database/models/InvitesData";

export class GiveawayManager {

  private static $instance: GiveawayManager;

  public static getInstance() {
    if(!this.$instance) {
      this.$instance = new GiveawayManager();
    }
    return this.$instance;
  }

  public async getGivewayDefaultEmbed(message: Message): Promise<MessageEmbed> {
    const data = await GiveawayData.findBy("messageid", message.id) as GiveawayData;
    const giveawayManager = GiveawayManager.getInstance();
    const rewardFormated = giveawayManager.formatRewards(data.reward)
    const participants = (await GiveawayNow.where({messageid: message.id})).length
    return getDefaultEmbed("Giveaways")
      .setTitle("GIVEAWAY")
      .setDescription(`\`\`\`Prix: ${ rewardFormated } \`\`\`\n**Informations:**\nCréateur: ${ await Application.getClient().users.fetch(data.creator) }\nFin: <t:${ data.duration }:R>\nNombre de gagnants: ${ data.winnercount }\nNombre de participant(s): ${ participants }\n${ (data.level || data.invite) ? `\n**Requis:**\n ${ data.invite ? `\n\`🔖\` Nombre d'invitation(s) minimal: **${ data.invite }**` : "" }` : "" }\n**Comment participer?**\nPour participer, vous devez appuyez sur le bouton et ne pas quitter le discord avant la fin du giveaway.`);
  }

  public async createGiveaway(giveaway: GiveawayObject) {
    const data = await GiveawayData.create({
      creator: giveaway.creator,
      duration: giveaway.duration,
      reward: giveaway.reward,
      winnercount: giveaway.winnerCount,
      channelid: giveaway.channelID,
      guildid: giveaway.guildID,
      messageid: giveaway.messageID,
      invite: giveaway.invite,
      level: giveaway.level
    }) as GiveawayData;

    Logger.send("success", `Un giveaway a été créé par ${ Application.getClient()!.users.resolve(data.creator)!.username }`);
  }


  public async deleteGiveaway(messageID: Snowflake) {
    const data = await GiveawayData.where("messageid", messageID) as GiveawayData[]
    data.forEach(value => value.delete());

    const dataSecond = await GiveawayNow.where("messageid", messageID) as GiveawayNow[]
    dataSecond.forEach(value => value.delete());
  }

  public async addParticipation(interaction: ButtonInteraction) {
    const member = interaction.member! as GuildMember
    const message = interaction.message as Message;
    const hasGiveaway = await this.getGiveaway(interaction.message.id);
    if(!hasGiveaway) {
      await sendEphemeralMessage(interaction, "Impossible de participer à ce giveaway.", false)
      return;
    }
    // const data = await GiveawayNow.findBy<GiveawayNow>({
    //   userid: member.id,
    //   messageid: interaction.message!.id
    // }) as GiveawayNow

    const data2 = await GiveawayNow.findAll() as GiveawayNow[]
    const data = data2.filter(value => value.userid === member.id && value.messageid === message.id)[0]


    if(!data) {
      if(hasGiveaway.invite) {
        const inviteData = await InvitesData.findBy({userid: member.id}) as InvitesData
        if(!inviteData || inviteData.invitecount < hasGiveaway.invite) {
          await sendEphemeralMessage(interaction, `Vous n'avez pas suffisamment d'invitations.\n\n\`🔖\` Vos invitations: **${ inviteData ? inviteData.invitecount : "0" }**`, false);
          return;
        }
      }


      await GiveawayNow.create({
        userid: member.id,
        messageid: interaction.message.id
      });
      /*
      * Edit du nombre de participants
      * */
      if(!hasGiveaway.timestamp || hasGiveaway.timestamp < Date.now()) {
        await message.edit({embeds: [await this.getGivewayDefaultEmbed(message)]})
        await hasGiveaway.update({timestamp: Date.now() + 30 * 1000})
      }
      await sendEphemeralMessage(interaction, "Votre participation a été prise en compte!", true);
    } else {
      await sendEphemeralMessage(interaction, "Vous avez déjà participé à ce giveaway.", false);
    }
  }

  public async resetParticipation(messageID: Snowflake) {
    const data = await GiveawayNow.where("messageid", messageID) as GiveawayNow[]
    data.forEach(value => {
      value.delete()
    })
  }

  public async executeGiveaway(messageid: Snowflake) {
    const giveaway = await this.getGiveaway(messageid);
    if(!giveaway) {
      Logger.send("error", `une erreur est survenue lors du giveaway #1 ${ messageid }`)
      return;
    }
    let numberOfWinners = giveaway?.winnercount
    if(!numberOfWinners) {
      Logger.send("warn", `une erreur est survenue lors du giveaway #2 ${ messageid }`)
      return;
    }

    const data = await GiveawayNow.where("messageid", messageid) as GiveawayNow[]
    const numberOfParticipation = data.length;

    let winnersID: string[] = []

    if(numberOfParticipation !== 0) {
      if(numberOfParticipation < numberOfWinners) {
        numberOfWinners = numberOfParticipation
      }

      while (winnersID.length < numberOfWinners) {

        let selectWinner;

        do {
          const winnerNumber = getRandomInt(numberOfParticipation);
          selectWinner = data[winnerNumber].userid;
          if(!((await Application.getClient()!.guilds.fetch(giveaway.guildid))?.members.cache.has(selectWinner))) continue;
        } while (winnersID.includes(selectWinner))
        winnersID.push(selectWinner);
      }
    }
    let winnerString = ""
    winnersID.forEach(value => winnerString += `\n➤ ${ Application.getClient()!.guilds.resolve(giveaway.guildid)?.members.resolve(value) }`)

    if(winnerString === "") {
      winnerString = "Aucun participant";
    }

    const channel = Application.getClient()!.guilds.resolve(giveaway.guildid)!.channels.resolve(giveaway.channelid) as unknown as TextChannel;
    const message = channel.messages.resolve(giveaway.messageid);


    if(!message) {
      const data = await GiveawayData.where("messageid", messageid) as GiveawayData[]
      data.forEach(value => value.delete());
      Logger.send("error", `une erreur est survenue lors du giveaway #3 ${ messageid }, delete du giveaway.`)
      return;
    }
    const rewardFormated = GiveawayManager.getInstance().formatRewards(giveaway.reward)

    const embed = await this.getGivewayDefaultEmbed(message);
    embed.setDescription(embed.description + `\n\n**Gagnants:** ${ winnerString }`)

    const button = new MessageActionRow()
      .addComponents(new MessageButton()
        .setStyle("DANGER")
        .setLabel("GiveawayObject terminé")
        .setDisabled(true)
        .setEmoji("⚠")
        .setCustomId("entendGiveaway"))

    await message.edit({embeds: [embed], components: [button]});

    await this.deleteGiveaway(giveaway.messageid);

    Logger.send("success", `Lancement du giveaway avec l'id de message: ${ messageid }`);
    Logger.send("success", "Les gagnants sont: " + winnersID.toString())
  }


  public async getGiveaway(messageid: Snowflake) {
    return await GiveawayData.findBy({messageid: messageid}) as GiveawayData
  }

  public formatRewards(reward: string) {
    let formatedReward = ""
    reward.split(", ").forEach(value => {
      formatedReward += `\n➤ ${ value }`
    })
    return formatedReward
  }
}