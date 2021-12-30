import BaseConfiguration from "../../configurations/BaseConfiguration.json"
import InvitesConfiguration from "../../configurations/InvitesConfiguration.json"
import ModerationConfiguration from "../../configurations/ModerationConfiguration.json"
import TicketConfiguration from "../../configurations/TicketConfiguration.json"
import GiveawayConfiguration from "../../configurations/GiveawaysConfiguration.json"
import TemporaryChannelConfiguration from "../../configurations/TemporaryChannelConfiguration.json"

import { InterfaceInvitesConfiguration } from "App/defaults/interfaces/InterfaceInvitesConfiguration";
import { InterfaceModerationConfiguration } from "App/defaults/interfaces/InterfaceModerationConfiguration";
import { InterfaceTicketConfiguration } from "App/defaults/interfaces/InterfaceTicketConfiguration";
import { InterfaceBaseConfiguration } from "App/defaults/interfaces/InterfaceBaseConfiguration";
import { InterfaceTemporaryChannelConfiguration } from "App/defaults/interfaces/InterfaceTemporaryChannelConfiguration";

export class ConfigManager {
  // @ts-ignore
  private static baseConfiguration: InterfaceBaseConfiguration = BaseConfiguration

  // @ts-ignore
  private static invitesConfiguration: InterfaceInvitesConfiguration = InvitesConfiguration
  // @ts-ignore
  private static moderationConfiguration: InterfaceModerationConfiguration = ModerationConfiguration

  private static ticketConfiguration: InterfaceTicketConfiguration = TicketConfiguration

  private static giveawayConfiguration = GiveawayConfiguration

  private static temporaryChannelConfiguration :InterfaceTemporaryChannelConfiguration = TemporaryChannelConfiguration

  public static getBaseConfiguration() {
    return this.baseConfiguration
  }

  public static getTemporaryChannelConfiguration(){
    return this.temporaryChannelConfiguration
  }


  public static getInvitesConfiguration() {
    return this.invitesConfiguration
  }

  public static getModerationConfiguration() {
    return this.moderationConfiguration
  }


  public static getTicketConfiguration() {
    return this.ticketConfiguration
  }

  public static getGiveawayConfiguration() {
    return this.giveawayConfiguration
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