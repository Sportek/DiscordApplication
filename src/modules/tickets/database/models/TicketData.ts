import { Model, BaseModel, Uuid, beforeCreate } from '@discord-factory/storage-next'

@Model('ticket_data')
export default class TicketData extends BaseModel<TicketData> {
  public id: string
  public userid: string
  public channelid: string

  @beforeCreate()
  protected beforeInsert (model: TicketData) {
    model.id = Uuid.generateV4()
  }
}