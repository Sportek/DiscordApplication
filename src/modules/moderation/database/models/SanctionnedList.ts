import { Model, BaseModel, Uuid, beforeCreate } from '@discord-factory/storage-next'

type sanctionType = "ban"|"mute"|"kick"|"warn";
@Model('sanctionned_list')
export default class SanctionnedList extends BaseModel<SanctionnedList> {
  public id: string

  public playerid: string

  public bantype: sanctionType

  public debandate: number


  @beforeCreate()
  protected createUUID (model: SanctionnedList) {
    model.id = Uuid.generateV4()
  }
}