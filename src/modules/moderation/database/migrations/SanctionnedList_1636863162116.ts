import { Migration, BaseMigration, Schema, Table } from '@discord-factory/storage-next'

@Migration()
export default class SanctionnedList_1636863162117 extends BaseMigration {
  public tableName = 'sanctionned_lists'

  public async up (schema: Schema): Promise<any> {
    return schema.createTable(this.tableName, (table: Table) => {
      table.string('id').primary()
      table.string("playerid")
      table.string("bantype")
      table.bigInteger("debandate")
    })
  }

  public async down (schema: Schema): Promise<any> {
    return schema.dropTableIfExists(this.tableName)
  }
}