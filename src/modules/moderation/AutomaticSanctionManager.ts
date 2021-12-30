
import {GuildMember} from "discord.js";
import { DurationsEnum } from "App/modules/moderation/enums/DurationsEnum";
import { Application } from "@sportek/core-next-sportek";
import { ConfigManager } from "App/defaults/ConfigManager";
import SanctionnedList from "App/modules/moderation/database/models/SanctionnedList";
import SanctionSave from "App/modules/moderation/database/models/SanctionSave";



// Ok c'est vraiment pas propre, mais flemme de refaire tout le système pour prendre ça en compte :x

export class AutomaticSanctionManager {

    private member: GuildMember;
    private readonly reason: string;
    private readonly duration: DurationsEnum;

    constructor(member: GuildMember, reason: string, duration: DurationsEnum) {
        this.reason = reason;
        this.member = member;
        this.duration = duration;
    }


    public async execute() {
        await SanctionSave.create({
            playerid: this.member.id,
            banType: "mute",
            reason: this.reason,
            date: Date.now(),
            duration: this.duration,
            moderator: Application.getClient()!.user!.id,
        })

        await SanctionnedList.create({
            playerid: this.member.id,
            banType: "mute",
            debandate: Date.now() + this.duration,
        })
        try {
            await this.member.roles.add(ConfigManager.getModerationConfiguration().mutedRole)
        } catch (e) {

        }
    }
}