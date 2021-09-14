import 'module-alias'
import { Ignitor } from '@discord-factory/core-next'

(async () => {
  const [,, prefix, ...params] = process.argv
  const ignitor = new Ignitor()
  const init = await ignitor.createCommand()

  if (init) {
    const command = ignitor.container.cli.get(prefix)
    command.run(...params)
  }
  // process.exit()
})()
