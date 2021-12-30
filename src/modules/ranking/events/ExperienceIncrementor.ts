import {Message} from "discord.js";
import { BaseEvent, Event } from "@sportek/core-next-sportek";
import { PlayerManager } from "App/modules/ranking/PlayerManager";
import { Player } from "App/modules/ranking/Player";
import { getDefaultEmbed } from "App/defaults/MessageManager";
import Logger from "@leadcodedev/logger";
import { ConfigManager } from "App/defaults/ConfigManager";


@Event('messageCreate')
export default class ExperienceIncrementor implements BaseEvent {
    public async run(message: Message): Promise<void> {
        if (!message.guild) return;
        if (message.author.bot) return;
        const previousPlayer = await new Player(message.author.id).initialize();
        const previousLevel = previousPlayer.getLeveling().level
        await PlayerManager.getInstance().increasePlayerExperience(message.member!)
        const nowPlayer = await new Player(message.author.id).initialize();
        const nowLevel = nowPlayer.getLeveling().level
        if (previousLevel != nowLevel) {
            ConfigManager.getRankingConfiguration().rewards.filter(value => value.level === nowLevel).forEach(value => message.member?.roles.add(value.roleid))
            const embed = getDefaultEmbed("Niveaux")
                .setDescription(`Félicitations ${message.member?.displayName}, vous passez niveau ${nowLevel}! 🎉`)
            const sendedMessage = await message.channel.send({embeds: [embed]});
            setTimeout(()=> {
                sendedMessage.delete().catch(reason => Logger.send("error", reason));
            }, 10000)
        }
    }
}
