import { Snowflake, User } from "discord.js";
import InvitesData from "App/modules/invites/database/models/InvitesData";
import { getDefaultEmbed } from "App/defaults/MessageManager";

export class InviteManageData {
  private static $instance: InviteManageData;
  public static getInstance() {
    if(!this.$instance) {
      this.$instance = new InviteManageData();
    }
    return this.$instance;
  }

  public getJoinAndLeaveLogEmbed(member: User, inviter: User | string, type: boolean) {
    if(!inviter) inviter = "Non définit";
    return getDefaultEmbed("Confirmation")
      .setAuthor(type ? "Join" : "Leave", type ? "https://cdn.discordapp.com/emojis/821329948634644481.png?size=128" : "https://cdn.discordapp.com/emojis/821329948903997440.png?size=128")
      .setColor(type ? "#43B581" : "#F04747")
      .setDescription(`\`🍂\` Pseudonyme: ${member} (${member.tag})\n\`📆\`Création du compte: <t:${Math.floor(member.createdAt.getTime()/1000)}:D> (<t:${Math.floor(member.createdAt.getTime()/1000)}:R>)\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\`🍁\` Invité par: ${inviter} (${inviter instanceof User ? inviter.tag : inviter})\n\`📆\` Création du compte: <t:${inviter instanceof User ? Math.floor(inviter.createdAt.getTime()/1000) : inviter}:D> (<t:${inviter instanceof User ? Math.floor(inviter.createdAt.getTime()/1000) : inviter}:R>)`)
  }

  public async getPlayerDataCreateIfNull(userID: Snowflake, inviterID: Snowflake = "aucun") {
    const data = await InvitesData.findBy({userid: userID}) as InvitesData
    if(data) return data;
    await InvitesData.create({
      userid: userID,
      invitecount: 0,
      inviterid: inviterID,
    })

    return await InvitesData.findBy({userid: userID}) as InvitesData
  }

  public async getPlayerData(userID: Snowflake) {
    const data = await InvitesData.findBy({userid: userID}) as InvitesData
    if(data) return data;
  }


  public async inviteAdd(userID: Snowflake, number: number) {
    const data = await this.getPlayerDataCreateIfNull(userID);

    if(data) {
      await data.update({invitecount: data.invitecount += number})
    }
  }

  public async inviteRemove(userID: Snowflake, number: number) {
    const data = await this.getPlayerDataCreateIfNull(userID);
    if(data) {
      await data.update({invitecount: data.invitecount -= number})
    }
  }

  public async removeAllInvites() {
    const data = await InvitesData.findAll() as InvitesData[]
    for (const value of data) {
      await this.inviteRemove(value.userid, value.invitecount)
    }
  }

}