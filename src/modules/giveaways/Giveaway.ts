import { InterfaceGiveawayConfiguration } from "App/modules/giveaways/InterfaceGiveawayConfiguration";
import GiveawayConfiguration from "App/modules/giveaways/configuration/Configuration.json";

export class Giveaway {
  private static giveawayConfiguration: InterfaceGiveawayConfiguration = GiveawayConfiguration
  public static getConfiguration() {
    return this.giveawayConfiguration
  }
}