import { Migration, BaseMigration, Schema, Table } from '@discord-factory/storage-next'

@Migration()
export default class ChannelData_1638584862494 extends BaseMigration {
  public tableName = 'channel_datas'

  public async up (schema: Schema): Promise<any> {
    return schema.createTable(this.tableName, (table: Table) => {
      table.string('id').primary()

      table.string("owner_id")

      table.string("channel_id")
      // Your database migration here
    })
  }

  public async down (schema: Schema): Promise<any> {
    return schema.dropTableIfExists(this.tableName)
  }
}