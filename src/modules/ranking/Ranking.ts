import RankingConfiguration from "App/modules/ranking/configuration/Configuration.json";
import { InterfaceRankingConfiguration } from "App/modules/ranking/InterfaceRankingConfiguration";

export class Ranking {
  private static rankingConfiguration: InterfaceRankingConfiguration = RankingConfiguration
  public static getConfiguration() {
    return this.rankingConfiguration
  }
}