import { Model, BaseModel, Uuid, beforeCreate } from '@discord-factory/storage-next'

@Model('sanction_save')
export default class SanctionSave extends BaseModel<SanctionSave> {
  public id: string

  public playerid: string
  public bantype: string
  public duration: number
  public reason: string
  public date: number
  public moderator: string
  public warnid: number


  @beforeCreate()
  protected createUUID(model: SanctionSave) {
    model.id = Uuid.generateV4()
  }
}