import 'module-alias'
import { Ignitor } from '@discord-factory/core-next'

(async () => {
  const [,, prefix, ...params] = process.argv
  const ignitor = new Ignitor()
  await ignitor.createCommand()

  const command = ignitor.container.cli.get(prefix)
  await command.run(...params)
})()
