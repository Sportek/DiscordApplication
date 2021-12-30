import { Model, BaseModel, Uuid, beforeCreate } from '@discord-factory/storage-next'

@Model('giveaway_data')
export default class GiveawayData extends BaseModel<GiveawayData> {
  public id: string

  public creator: string

  public reward: string

  public winnercount: number

  public duration: number

  public messageid: string

  public channelid: string

  public guildid: string

  public level: number | null

  public invite: number | null

  public timestamp: number

  @beforeCreate()
  protected beforeInsert (model: GiveawayData) {
    model.id = Uuid.generateV4()
  }
}