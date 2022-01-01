import BaseConfiguration from "../../configurations/BaseConfiguration.json"
import InvitesConfiguration from "../../configurations/InvitesConfiguration.json"
import ModerationConfiguration from "../../configurations/ModerationConfiguration.json"
import TicketConfiguration from "../../configurations/TicketConfiguration.json"
import RankingConfiguration from "../../configurations/RankingConfiguration.json"
import TemporaryChannelConfiguration from "../../configurations/TemporaryChannelConfiguration.json"
import SecurityConfiguration from "../../configurations/SecurityConfiguration.json"

import { InterfaceInvitesConfiguration } from "App/defaults/interfaces/InterfaceInvitesConfiguration";
import { InterfaceModerationConfiguration } from "App/defaults/interfaces/InterfaceModerationConfiguration";
import { InterfaceTicketConfiguration } from "App/defaults/interfaces/InterfaceTicketConfiguration";
import { InterfaceBaseConfiguration } from "App/defaults/interfaces/InterfaceBaseConfiguration";
import { InterfaceRankingConfiguration } from "App/defaults/interfaces/InterfaceRankingConfiguration";
import { InterfaceTemporaryChannelConfiguration } from "App/defaults/interfaces/InterfaceTemporaryChannelConfiguration";
import { InterfaceSecurityConfiguration } from "App/defaults/interfaces/InterfaceSecurityConfiguration";

export class ConfigManager {
  // @ts-ignore
  private static baseConfiguration: InterfaceBaseConfiguration = BaseConfiguration

  private static temporaryChannelConfiguration: InterfaceTemporaryChannelConfiguration = TemporaryChannelConfiguration

  private static securityConfiguration: InterfaceSecurityConfiguration = SecurityConfiguration

  // @ts-ignore
  private static invitesConfiguration: InterfaceInvitesConfiguration = InvitesConfiguration
  // @ts-ignore
  private static moderationConfiguration: InterfaceModerationConfiguration = ModerationConfiguration

  private static ticketConfiguration: InterfaceTicketConfiguration = TicketConfiguration

  private static rankingConfiguration : InterfaceRankingConfiguration = RankingConfiguration

  public static getBaseConfiguration() {
    return this.baseConfiguration
  }

  public static getSecurityConfiguration(){
    return this.securityConfiguration
  }

  public static getRankingConfiguration(){
    return this.rankingConfiguration
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