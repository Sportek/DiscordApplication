import {Collection, GuildMember, Message, Snowflake} from "discord.js";
import { getDefaultEmbed } from "App/defaults/MessageManager";
import { AutomaticSanctionManager } from "App/modules/moderation/AutomaticSanctionManager";
import { DurationsEnum } from "App/modules/moderation/enums/DurationsEnum";
import { ConfigManager } from "App/defaults/ConfigManager";

type WarningsType = "Link"|"Trop de mentions"|"Ghost ping"

export class WarningCollection {
    private static $instance: WarningCollection;
    private warnings: Collection<Snowflake, number> = new Collection<Snowflake, number>();
    private _maxWarnings: number = ConfigManager.getModerationConfiguration().automaticSanctions.maxWarnings

    public static getInstance() {
        if (!this.$instance) {
            this.$instance = new WarningCollection();
        }
        return this.$instance;
    }

    public async addWarning(member: GuildMember, message: Message, type: WarningsType) {
        const warning = this.warnings.get(member.id);
        this.warnings.set(member.id, warning ? warning + 1 : 1);

        await this.checkIfLotOfWarnings(member)
        const warnings = this.getPlayerWarning(member);
        const maxWarnings = this.maxWarnings;

        if (warnings! < maxWarnings) {
            const embed = getDefaultEmbed("Sanctions")
                .setDescription(`${member}, vous venez de recevoir un avertissement. Des sanctions peuvent être enclanchée en cas de trop grand nombre d'avertissements. Il est interdit de: \n\n**- Mentionner plus de ${ConfigManager.getModerationConfiguration().automaticSanctions.maxWarnings} personnes dans un même message.\n- Mentionner un utilisateur et ensuite supprimer la mention.**\n\n📌 Raison de l'avertissement: ${type}.\n📌 Votre nombre d'avertissements: ${warnings}. \n📌 Nombre maximum d'avertissement avant sanction: ${maxWarnings}.`)
            message.channel.send({embeds: [embed]});
            return;
        }

        const embed = getDefaultEmbed("Sanctions")
            .setDescription(`${member}, vous avez été sanctionné de façon automatique, suite à plusieurs avertissements, pour non respect du règlement.\n\n📌 Durée de la sanction: 1 heure.\n📌 Raison de la sanction: ${type}.`);
        message.channel.send({embeds: [embed]});

    }

    private async checkIfLotOfWarnings(member: GuildMember) {
        const warning = this.getPlayerWarning(member);
        if (warning) {
            if (warning >= this.maxWarnings) {
                await new AutomaticSanctionManager(member, "Sanction automatique", DurationsEnum["1 heure"]).execute();
                this.resetPlayerWarning(member)
            }
        }
    }

    public getPlayerWarning(member: GuildMember) {
        return this.warnings.get(member.id);
    }

    public getWarnings(): Collection<Snowflake, number> {
        return this.warnings;
    }

    public resetPlayerWarning(member: GuildMember) {
        this.warnings.delete(member.id)
    }

    public resetAllWarnings() {
        this.warnings.clear();
    }

    get maxWarnings(): number {
        return this._maxWarnings;
    }
}