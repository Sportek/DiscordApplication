import { CommandInteraction, GuildMember } from 'discord.js'
import { BaseCommand, Command } from "@sportek/core-next-sportek";
import { ConfigManager } from "App/defaults/ConfigManager";
import { Player } from "App/modules/ranking/Player";
import { getNumberToLimit } from "App/defaults/MathUtils";
import { getDefaultEmbed } from "App/defaults/MessageManager";


@Command({
    scope: [ConfigManager.getBaseConfiguration().guild.id],
    options: {
        name: 'profil',
        description: "Obtenir les informations du profil d'un utilisateur",
        options: [{
            name: "utilisateur",
            description: "Utilisateur ciblé.",
            type: "USER",
            required: false
        }],
    },
})
export default class PlayerProfil implements BaseCommand {
    // @ts-ignore
    public async run(interaction: CommandInteraction): Promise<void> {
        const member = interaction.options.getMember("utilisateur") ? interaction.options.getMember("utilisateur") as GuildMember : interaction.member as GuildMember;
        const player = await new Player(member.id).initialize();
        const level = player.getLeveling().level;
        const remainExp = player.getLeveling().remainingExperience;
        const neededExp = player.getLeveling().neededExperience;

        let progressiveBar = "";
        const neededBar = getNumberToLimit(remainExp, neededExp, 10);
        const greyBar = 10 - neededBar;
        for (let i = 0; i < neededBar; i++) {
            progressiveBar += "<:line:883891963223494658>";
        }
        for (let i = 0; i < greyBar; i++) {
            progressiveBar += "<:empty_line:883888113628364860>";
        }


        const embed = getDefaultEmbed("Utilitaires")
            .setDescription(`
        ${ConfigManager.getRankingConfiguration().nitroBoost.activate ? member.roles.cache.has(ConfigManager.getRankingConfiguration().nitroBoost.roleid) ?  `<:nitro:895366665339019335> Nitro: **+${ConfigManager.getRankingConfiguration().nitroBoost.boost * 100}%** d'expérience`: "" : ""}
            
        **Niveau**: ${level}
        ${progressiveBar} ${remainExp}/${neededExp}`)
            .setAuthor("Profil de "+member.user.username, member.user.avatarURL()!)

        await interaction.reply({embeds: [embed]});
    }
}
