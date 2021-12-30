import {CommandInteraction, GuildMember, TextChannel} from "discord.js";
import { ConfigManager } from "App/defaults/ConfigManager";
import { getDefaultEmbed, sendEphemeralMessage } from "App/defaults/MessageManager";
import { DurationsEnum } from "App/modules/moderation/enums/DurationsEnum";
import { Application } from "@sportek/core-next-sportek";
import SanctionnedList from "App/modules/moderation/database/models/SanctionnedList";
import SanctionSave from "App/modules/moderation/database/models/SanctionSave";

type Sanctions = "BAN" | "TEMPBAN" | "MUTE" | "TEMPMUTE";
type sanctionType = "ban"|"mute"|"kick"|"warn";
type Duration = number | "Infinity"

export class SanctionsManager {

    private readonly _member: GuildMember;
    private readonly _duration: number;
    private readonly _reason: string;
    private readonly _interaction: CommandInteraction;
    private readonly _moderator: GuildMember;

    constructor(interaction: CommandInteraction) {
        this._moderator = interaction.member! as GuildMember;
        this._interaction = interaction;
        this._member = interaction.options.getMember("utilisateur") as GuildMember;
        const dura = interaction.options.getNumber("durée");
        if (dura === null) {
            this._duration = Number.POSITIVE_INFINITY
        } else {
            this._duration = dura
        }
        this._reason = interaction.options.getString("raison")!;
    }

    private getReason(): string {
        return this._reason;
    }

    private getModerator(): GuildMember {
        return this._moderator;
    }

    private getMember(): GuildMember {
        return this._member;
    }

    private getDuration(): number {
        return this._duration;
    }

    private getInteraction(): CommandInteraction {
        return this._interaction
    }
    
    private async logSanction(sanctionType: sanctionType) {

        await SanctionSave.create({
            playerid: this.getMember().id,
            bantype: sanctionType,
            reason: this.getReason(),
            date: Date.now(),
            duration: this.getDuration(),
            moderator: this.getModerator().id,
        })
        await SanctionnedList.create({
            playerid: this.getMember().id,
            bantype: sanctionType,
            debandate: Date.now() + this.getDuration(),
        })

        const moderatorLogger = await Application.getClient()?.channels.fetch(ConfigManager.getModerationConfiguration().channelModerationLogs) as unknown as TextChannel

        const embed = getDefaultEmbed("Sanctions")
            .setAuthor(this._moderator.user.username, this._moderator.user.avatarURL()!)
            .setTitle(`${Application.getClient().user!.username} ➜ Sanctions`)
            .setDescription(`\`📌\` **Joueur sanctionné:** ${this._member.user.tag} (${this._member.user.id}) 
        \`📌\` **Type de sanction:** ${sanctionType}
        \`📌\` **Durée:** ${DurationsEnum[this._duration]}
        \`📌\` **Raison:** ${this._reason}`);
        await moderatorLogger.send({embeds:[embed]});
    }

    private async doVerifications(sanction: sanctionType) {
        const interraction = this.getInteraction();
        const moderator = interraction.member as GuildMember;
        const sanctionnedMember = this.getMember();

        if (!sanctionnedMember.bannable) {
            await sendEphemeralMessage(interraction, "Je n'ai pas la permission de sanctionner cet utilisateur.", false);
            return false;
        }

        if (!(moderator.roles.highest.position > sanctionnedMember.roles.highest.position)) {
            await sendEphemeralMessage(interraction, "Vous n'avez pas la permission de sanctionner cet utilisateur", false)
            return false;
        }

        return true;

    }

    public async execute(sanction: sanctionType) {

        if (!await this.doVerifications(sanction)) {
            return;
        }

        const test = this.getInteraction().options.get("durée")?.value;

        switch (sanction) {
            case "ban":
                sanction = "ban"
                this.getInteraction().guild?.bans.create(this._member, {days: 1, reason: `Hyperion: ${this._reason}`});
                // @ts-ignore
                await sendEphemeralMessage(this.getInteraction(), `Vous avez bannis avec succès ${this.getMember()} (${this.getMember().id}) pour une durée de ${DurationsEnum[test]}.`, true);
                break;
            case "mute":
                try {
                    sanction = "mute"
                    await this._member.roles.add(ConfigManager.getModerationConfiguration().mutedRole)
                    // @ts-ignore
                    await sendEphemeralMessage(this.getInteraction(), `Vous avez réduit au silence avec succès ${this.getMember()} (${this.getMember().id}) pour une durée de ${DurationsEnum[test]}.`, true)
                } catch (e) {
                    console.error(e)
                    await sendEphemeralMessage(this.getInteraction(), "Impossible d'ajouter le grade à l'utilisateur.", false);
                }

                break;
        }

        await this.logSanction(sanction);
    }
}
