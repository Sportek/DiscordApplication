import { Model, BaseModel, Uuid, beforeCreate } from '@discord-factory/storage-next'

type messType = "staff"

@Model('message_update')
export default class MessageUpdate extends BaseModel<MessageUpdate> {
  public id: string
  public messagetype: messType
  public messageid: string
  public channelid: string


  @beforeCreate()
  protected createUUID (model: MessageUpdate) {
    model.id = Uuid.generateV4()
  }
}