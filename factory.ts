import 'module-alias'
import { Ignitor } from '@sportek/core-next-sportek'

(async () => {
  const ignitor = new Ignitor()
  await ignitor.exec()
})()
