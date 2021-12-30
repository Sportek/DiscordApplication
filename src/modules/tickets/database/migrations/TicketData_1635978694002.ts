import { Migration, BaseMigration, Schema, Table } from '@discord-factory/storage-next'

@Migration()
export default class TicketData_1635978694004 extends BaseMigration {
  public tableName = 'ticket_datas'

  public async up (schema: Schema): Promise<any> {
    return schema.createTable(this.tableName, (table: Table) => {
      table.string('id').primary()
      table.string("userid")
      table.string("channelid")
    })
  }

  public async down (schema: Schema): Promise<any> {
    return schema.dropTableIfExists(this.tableName)
  }
}