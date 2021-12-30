import { Migration, BaseMigration, Schema, Table } from '@discord-factory/storage-next'

@Migration()
export default class SanctionSave_1636863143529 extends BaseMigration {
  public tableName = 'sanction_saves'

  public async up (schema: Schema): Promise<any> {
    return schema.createTable(this.tableName, (table: Table) => {
      table.string('id').primary()
      table.string("playerid")
      table.string("bantype")
      table.bigInteger("duration")
      table.string("reason")
      table.bigInteger("date")
      table.string("moderator")
      table.bigInteger("warnid")
    })
  }

  public async down (schema: Schema): Promise<any> {
    return schema.dropTableIfExists(this.tableName)
  }
}