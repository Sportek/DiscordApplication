import TemporaryChannelConfiguration from "App/modules/ranking/configuration/Configuration.json";
import {
  InterfaceTemporaryChannelConfiguration
} from "App/modules/temporaryChannels/InterfaceTemporaryChannelConfiguration";

export class TemporaryChannel {
  // @ts-ignore
  private static temporaryChannelConfiguration: InterfaceTemporaryChannelConfiguration = TemporaryChannelConfiguration

  public static getConfiguration() {
    return this.temporaryChannelConfiguration
  }
}