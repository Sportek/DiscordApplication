import {Collection, Snowflake} from "discord.js";

export class MessageCollection {
    private static $instance: MessageCollection;
    private _messageCollect: Collection<Snowflake, number> | undefined
    public static getInstance() {
        if (!this.$instance) {
            this.$instance = new MessageCollection();
        }
        return this.$instance;
    }
    get messageCollect(): Collection<Snowflake, number> | undefined {
        return this._messageCollect;
    }

    set messageCollect(value: Collection<Snowflake, number> | undefined) {
        this._messageCollect = value;
    }

    public messageAdd(messageid: Snowflake){
        if(!this._messageCollect?.get(messageid)){
            this._messageCollect?.set(messageid, 1);
            return;
        }
        this._messageCollect?.set(messageid, this._messageCollect?.get(messageid)! + 1)
    }
}