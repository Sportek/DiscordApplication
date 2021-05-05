import { Factory } from '@discord-factory/core'

Factory.getInstance().init().then(() => {
  console.log(Factory.getInstance().$container.events)
})