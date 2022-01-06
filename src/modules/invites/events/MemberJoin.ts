import { GuildMember, Invite, TextChannel } from "discord.js";
import { Application, BaseEvent, Event } from "@sportek/core-next-sportek";
import { InviteCollection } from "App/modules/invites/InviteCollection";
import Logger from "@leadcodedev/logger";
import { ConfigManager } from "App/defaults/ConfigManager";
import { InviteManageData } from "App/modules/invites/InviteManageData";
import { getDefaultEmbed } from "App/defaults/MessageManager";
import { Invites } from "App/modules/invites/Invites";


@Event('guildMemberAdd')
export default class MemberJoin implements BaseEvent {
  public async run(member: GuildMember): Promise<void> {

    if(member.partial) member = await member.fetch();
    if(member.user.bot) return;
    const welcomeChannel = await Application.getClient().channels.fetch(Invites.getConfiguration().channelid);
    if(!welcomeChannel) return Logger.send("error", "Impossible de trouver le salon de join.");

    const cachedInvites = InviteCollection.getInstance().getInvites();
    const newInvites = await member.guild.invites.fetch();

    const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code)!.uses! < inv.uses!);
    const configuration = Invites.getConfiguration().memberJoin
    if(!configuration) return Logger.send("error", "Impossible de trouver la configuration.");

    InviteCollection.getInstance().defineInvites(newInvites);

    /*
    * Add role
    * */
    await member.roles.add(Invites.getConfiguration().defaultRole);

    if(usedInvite) {
      if(usedInvite.inviter) {
        const inviterUser = usedInvite.inviter
        const inviteManager = InviteManageData.getInstance();
        await inviteManager.getPlayerDataCreateIfNull(member.id, inviterUser.id);
        await inviteManager.inviteAdd(inviterUser.id, 1);
        const embed = getDefaultEmbed("Invitations")
          .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
          .setDescription(ConfigManager.replaceManyToVariables(configuration, [{name: "guildName", variable: member.guild.name}, {name: "playerUsername", variable: member.user.username}, {name: "memberCount", variable: member.guild.memberCount.toString()}, {name: "inviterTag", variable: inviterUser.tag}]))
        const channel = member.guild.channels.resolve(Invites.getConfiguration().channelid) as TextChannel;
        await channel.send({embeds: [embed]});
        Logger.send("success", `${member.displayName} a rejoint avec l'invitation de ${inviterUser.tag} (${usedInvite.code}).`)
        return;
      }
    }

    const embed = getDefaultEmbed("Invitations")
      .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
      .setDescription(ConfigManager.replaceManyToVariables(configuration, [{name: "guildName", variable: member.guild.name}, {name: "playerUsername", variable: member.user.username}, {name: "memberCount", variable: member.guild.memberCount.toString()}, {name: "inviterTag", variable: "inconnu"}]))
    const channel = member.guild.channels.resolve(Invites.getConfiguration().channelid) as TextChannel;
    await channel.send({embeds: [embed]});
  }
}
