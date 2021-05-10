import 'module-alias/register'
import { Factory } from '@discord-factory/core'

Factory.getInstance().setup().then(() => {
  // console.log(Factory.getInstance().$container.middlewares)
})