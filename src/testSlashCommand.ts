import { Command, BaseCommand } from 'ioc:factory/Core/Command'
import { CommandInteraction } from 'ioc:factory/Discord/Event'

@Command({
  scope: ['583050048766476353'],
  roles: ['602194770084888650'],
  options: {
    name: 'TestMiaouddd',
    description: 'test description command',
    options: [],
  },
})
export default class TestSlashCommand extends BaseCommand {
  public async run (interaction: CommandInteraction): Promise<void> {
  }
}