import {Collection, Snowflake} from "discord.js";

export class LimiteExperienceCollection {

    private static $instance: LimiteExperienceCollection;
    private _limiteExperience: Collection<Snowflake, number> = new Collection<Snowflake, number>();
    public static getInstance() {
        if (!this.$instance) {
            this.$instance = new LimiteExperienceCollection();
        }
        return this.$instance;
    }

    get limiteExperience(): Collection<Snowflake, number> | undefined {
        return this._limiteExperience;
    }

    public setLimiteExperience(userid: Snowflake){
        this._limiteExperience.set(userid, Date.now() +  60 * 1000);
    }

    public getLimiteExperience(userid: Snowflake){
        return this._limiteExperience?.get(userid);
    }
}