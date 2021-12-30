import {Model, BaseModel, Uuid, beforeCreate} from '@discord-factory/storage-next'

@Model('message_cache')
export default class MessageCache extends BaseModel<MessageCache> {

  public id: string
  public title: string
  public embed: boolean
  public playermessageid: string
  public playerchannelid: string
  public botmessageid: string
  public botchannelid: string

  @beforeCreate()
  protected beforeCreate (model: MessageCache) {
    model.id = Uuid.generateV4()
  }
}