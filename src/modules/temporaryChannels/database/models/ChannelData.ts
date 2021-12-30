import { Model, BaseModel, Uuid, beforeCreate } from '@discord-factory/storage-next'
import { Snowflake } from "discord.js";

@Model('channel_data')
export default class ChannelData extends BaseModel<ChannelData> {
  public id: string

  public owner_id: Snowflake

  public channel_id: Snowflake

  @beforeCreate()
  protected createUUID (model: ChannelData) {
    model.id = Uuid.generateV4()
  }
}