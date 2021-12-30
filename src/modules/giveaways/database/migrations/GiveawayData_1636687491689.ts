import { Migration, BaseMigration, Schema, Table } from '@discord-factory/storage-next'

@Migration()
export default class GiveawayData_1636687491691 extends BaseMigration {
  public tableName = 'giveaway_datas'

  public async up (schema: Schema): Promise<any> {
    return schema.createTable(this.tableName, (table: Table) => {
      table.string('id').primary()
      table.string("creator")
      table.string("reward")
      table.integer("winnercount")
      table.bigInteger("duration")
      table.string("messageid")
      table.string("channelid")
      table.string("guildid")
      table.integer("level").nullable()
      table.integer("invite").nullable()
      table.bigInteger("timestamp")
    })
  }

  public async down (schema: Schema): Promise<any> {
    return schema.dropTableIfExists(this.tableName)
  }
}