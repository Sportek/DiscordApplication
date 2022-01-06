import TicketConfiguration from "App/modules/ranking/configuration/Configuration.json";
import { InterfaceTicketConfiguration } from "App/modules/tickets/InterfaceTicketConfiguration";

export class Ticket {
  // @ts-ignore
  private static ticketConfiguration: InterfaceTicketConfiguration = TicketConfiguration
  public static getConfiguration() {
    return this.ticketConfiguration
  }
}