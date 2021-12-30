import {Collection, Invite} from "discord.js";
import v8 from "v8";

export class InviteCollection {
    private static $instance: InviteCollection;
    private invites: Collection<string, Invite> = new Collection<string, Invite>();

    public static getInstance() {
        if(!this.$instance){
            this.$instance = new InviteCollection();
        }
        return this.$instance;
    }

    public defineInvites(invites: Collection<string, Invite>) {

        const structuredClone = obj => {
            return v8.deserialize(v8.serialize(obj));
        }
        this.invites = structuredClone(invites);
    }

    public getInvites(): Collection<string, Invite> {
        return this.invites;
    }
}