import ModerationConfiguration from "App/modules/moderation/configuration/Configuration.json";
import { InterfaceModerationConfiguration } from "App/modules/moderation/InterfaceModerationConfiguration";

export class Moderation {
  // @ts-ignore
  private static moderationConfiguration: InterfaceModerationConfiguration = ModerationConfiguration
  public static getConfiguration() {
    return this.moderationConfiguration
  }
}