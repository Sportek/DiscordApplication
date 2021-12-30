import CoreCommands from '@discord-factory/core-commands'
import Storage from "@discord-factory/storage-next";

export default class Kernel {
  public registerAddons () {
    return [CoreCommands, Storage]
  }
}