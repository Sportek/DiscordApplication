import InviteConfiguration from "App/modules/invites/configuration/Configuration.json";
import { InterfaceInvitesConfiguration } from "App/modules/invites/InterfaceInvitesConfiguration";

export class Invites {
  // @ts-ignore
  private static invitesConfiguration: InterfaceInvitesConfiguration = InviteConfiguration
  public static getConfiguration() {
    return this.invitesConfiguration
  }
}