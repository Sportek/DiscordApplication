export type ConfigureOptions = "gifts" | "giveaways" | "invites" | "messages" | "moderation" | "ranking" | "ticket" | "base"

export class MessageConfigure {

  private readonly _configureType : ConfigureOptions;
  private readonly _message_link : string;

  constructor(configureType: ConfigureOptions, message_link : string) {
    this._message_link = message_link;
    this._configureType = configureType;
  }


  get configureType(): ConfigureOptions {
    return this._configureType;
  }

  get message_link(): string {
    return this._message_link;
  }
}