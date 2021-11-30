import BaseConfiguration from "../../configurations/BaseConfiguration.json"
import { InterfaceBaseConfiguration } from "App/defaults/interfaces/InterfaceBaseConfiguration";
import { ConfigureOptions } from "App/defaults/MessageConfigure";

export class ConfigManager {
  // @ts-ignore
  private static baseConfiguration: InterfaceBaseConfiguration = BaseConfiguration

  public static getBaseConfiguration() {
    return this.baseConfiguration
  }

  public static replaceToVariable(text: string, name: string, variable: string) {
    return text.replaceAll(`{${ name }}`, variable);
  }

  public static replaceManyToVariables(text: string, json: { name: string, variable: string }[]): string {
    json.forEach(value => {
      text = text.replaceAll(`{${ value.name }}`, value.variable)
    })
    return text;
  }

}