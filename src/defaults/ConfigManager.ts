import BaseConfiguration from "./configuration/Configuration.json"
import { InterfaceBaseConfiguration } from "App/defaults/interfaces/InterfaceBaseConfiguration";

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