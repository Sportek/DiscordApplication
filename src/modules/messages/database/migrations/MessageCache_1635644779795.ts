import { Migration, BaseMigration, Schema, Table } from '@discord-factory/storage-next'

@Migration()
export default class MessageCache_1635644779798 extends BaseMigration {
  public tableName = 'message_caches'

  public async up (schema: Schema): Promise<any> {
    return schema.createTable(this.tableName, (table: Table) => {
      table.string('id').primary()
      table.string("title").nullable()
      table.string("playermessageid")
      table.string("botmessageid")
      table.string("playerchannelid")
      table.string("botchannelid")
      table.boolean("embed")
    })
  }

  public async down (schema: Schema): Promise<any> {
    return schema.dropTableIfExists(this.tableName)
  }
}