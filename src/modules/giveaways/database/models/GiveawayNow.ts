import { Model, BaseModel, Uuid, beforeCreate } from '@discord-factory/storage-next'

@Model('giveaway_now')
export default class GiveawayNow extends BaseModel<GiveawayNow> {
  public id: string

  public messageid: string

  public userid: string

  @beforeCreate()
  protected beforeInsert (model: GiveawayNow) {
    model.id = Uuid.generateV4()
  }
}