import { GuildMember } from "discord.js";
import { LimiteExperienceCollection } from "App/modules/ranking/Collections/LimiteExperienceCollection";
import { Player } from "App/modules/ranking/Player";
import { ConfigManager } from "App/defaults/ConfigManager";

export class PlayerManager {

    private static $instance: PlayerManager;

    public static getInstance() {
        if (!this.$instance) {
            this.$instance = new PlayerManager();
        }
        return this.$instance;
    }

    public async increasePlayerExperience(guildMember: GuildMember) {
        const booster = 1 + ConfigManager.getRankingConfiguration().nitroBoost.boost;
        const limiteExperienceInstance = LimiteExperienceCollection.getInstance();
        let lastTimestamp = limiteExperienceInstance.getLimiteExperience(guildMember.id);
        if(lastTimestamp && lastTimestamp > Date.now()) return;
        const player = await new Player(guildMember.id).initialize();
        const defaultExp = PlayerManager.generateRandomNumber()
        const exp = Math.floor(defaultExp * (guildMember.roles.cache.has(ConfigManager.getRankingConfiguration().nitroBoost.roleid) ? booster : 1))
        await player.incrementExperienceNumber(exp)
        limiteExperienceInstance.setLimiteExperience(guildMember.id)
        /*
        * Check if player level up
        * */
    }
    private static generateRandomNumber() {
        const max = 20;
        const min = 10;
        return Math.floor(Math.random() * (max - min+1) + min);
    }
}