import { Model, BaseModel, Uuid, beforeCreate } from '@discord-factory/storage-next'

@Model('player_data')
export default class PlayerData extends BaseModel<PlayerData> {
  public id: string
  public userid: string
  public experience: number

  @beforeCreate()
  protected createUUID (model: PlayerData) {
    model.id = Uuid.generateV4()
  }
}