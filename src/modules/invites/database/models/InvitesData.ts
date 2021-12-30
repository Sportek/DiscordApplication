import { Model, BaseModel, Uuid, beforeCreate } from '@discord-factory/storage-next'

@Model('invites_data')
export default class InvitesData extends BaseModel<InvitesData> {
  public id: string

  public userid: string

  public invitecount: number

  public inviterid: string

  @beforeCreate()
  protected beforeInsert (model: InvitesData) {
    model.id = Uuid.generateV4()
  }

  // public async incrementInviteCount(number: number) {
  //   await this.update({invitecount: this.invitecount+= number})
  //   //this.invitecount+=number
  // }
}