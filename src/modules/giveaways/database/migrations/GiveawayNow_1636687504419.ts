import { Migration, BaseMigration, Schema, Table } from '@discord-factory/storage-next'

@Migration()
export default class GiveawayNow_1636687504419 extends BaseMigration {
  public tableName = 'giveaway_nows'

  public async up (schema: Schema): Promise<any> {
    return schema.createTable(this.tableName, (table: Table) => {
      table.string('id').primary()
      table.string("messageid")
      table.string("userid")
    })
  }

  public async down (schema: Schema): Promise<any> {
    return schema.dropTableIfExists(this.tableName)
  }
}