import {Message, Snowflake} from "discord.js";
import internal from "stream";

export class Giveaway {

    private readonly _messageID: Snowflake
    private readonly _reward: string
    private readonly _winnerCount: number
    private readonly _duration: number
    private readonly _creator: Snowflake
    private readonly _channelID: Snowflake
    private readonly _guildID: Snowflake
    private readonly _invite: number | null
    private readonly _level: number | null

    constructor(message: Message, reward: string, winnerCount: number, duration: number, creator: Snowflake, invite: number | null, level: number | null) {
        this._messageID = message.id
        this._reward = reward
        this._duration = duration
        this._creator = creator
        this._winnerCount = winnerCount
        this._channelID = message.channel.id
        this._guildID = message.guild!.id
        this._level = level
        this._invite = invite
    }

    get messageID(): Snowflake {
        return this._messageID;
    }

    get reward(): string {
        return this._reward;
    }

    get duration(): number {
        return this._duration;
    }

    get creator(): Snowflake {
        return this._creator;
    }

    get winnerCount(): number {
        return this._winnerCount;
    }

    get channelID(): Snowflake {
        return this._channelID;
    }

    get guildID(): Snowflake {
        return this._guildID;
    }

    get invite(): number | null {
        return this._invite;
    }

    get level(): number | null {
        return this._level;
    }
}