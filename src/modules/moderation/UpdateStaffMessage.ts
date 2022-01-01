import { Guild } from "discord.js";
import { getDefaultEmbed } from "App/defaults/MessageManager";
import { ConfigManager } from "App/defaults/ConfigManager";
import { convertTimestampToDate } from "App/defaults/TimeManager";

export class UpdateStaffMessage {

    public async updateMessage(guild: Guild) {
        let number = 0;
        let headstaff = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n👑 **Administration**\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
        let staff = "\n\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n🏹 **Modération**\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";


        const first = await userList(guild, "headstaff");
        const second = await userList(guild, "staff");

        headstaff += first![0];
        staff += second![0];
        // @ts-ignore
        number += first![1];
        // @ts-ignore
        number += second![1]



        return getDefaultEmbed("Utilitaires")
            .setTitle(`Liste du staff de ${guild.name} 📋`)
            .setDescription(`${headstaff}${staff}`)
            .addField("Informations", `**Membres de l'équipe:** ${number} 👥\n**Recrutement:** [✅]\n**Dernière actualisation:** ${convertTimestampToDate(Date.now())} ⏱️`);
    }
}

async function userList(guild: Guild, type: string) {

    let string = "";
    let number = 0;
    for (const value of ConfigManager.getModerationConfiguration().staffUpdater[type]) {
        const members = await guild.members.fetch();
        const role = await guild.roles.fetch(value);
        const collectionMembers = members.filter(value1 => value1.roles.cache.has(value));
        if(collectionMembers.size === 0) continue;
        string += `\n`
        collectionMembers.forEach(value1 => {
            number++;
            string += `\n${role} **|** ${value1.user.tag}`
        })
    }
    return [string, number];
}