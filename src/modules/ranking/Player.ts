import { Snowflake } from "discord.js";
import PlayerData from "App/modules/ranking/database/models/PlayerData";
import { PlayerExperience } from "App/modules/ranking/PlayerExperience";

export class Player {

  private readonly userid: Snowflake
  private _playerData: PlayerData | undefined


  constructor(userid: Snowflake) {
    this.userid = userid
  }


  public async initialize() {
    const data = await PlayerData.findBy<PlayerData>({userid: this.userid})
    if(data) {
      this._playerData = data
    } else {
      this._playerData = await PlayerData.create({
        userid: this.userid,
        experience: 0
      })
    }
    return this;
  }

  public async incrementExperienceNumber(number: number) {
    if(this._playerData) {
      await this._playerData.update({experience: this._playerData.experience + number})
    }
  }

  get playerData(): PlayerData | undefined {
    return this._playerData;
  }

  public getLeveling() {
    let experience: number = this._playerData!.experience;
    let level = 0;

    while (experience >= Player.calculate(level)) {
      experience -= Player.calculate(level);
      level++;
    }
    return new PlayerExperience(level, experience, Player.calculate(level));
  }

  private static calculate(level: number) {
    return ((4 * Math.pow(level, 2)) + (25 * level) + 100);
  }

}