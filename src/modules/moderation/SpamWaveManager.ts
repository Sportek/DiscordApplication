import { Snowflake, TextChannel } from "discord.js";
import { ConfigManager } from "App/defaults/ConfigManager";
import { Application } from "@sportek/core-next-sportek";
import Logger from "@leadcodedev/logger";

export class SpamWaveManager {

  private static $instance: SpamWaveManager;

  public time = [0, 5, 10, 15, 30, 60, 120, 300, 600, 1800, 3600, 7200, 21600]

  private channelsInfo: { channelid: Snowflake, message: number }[] = []

  public static getInstance() {
    if(!this.$instance) {
      this.$instance = new SpamWaveManager();
    }
    return this.$instance
  }

  public resetChannelsInfo() {
    setInterval(async () => {
      const editChannels = this.channelsInfo.filter(value => value.message <= ConfigManager.getModerationConfiguration().limitMessagePerMinute / 2);
      for (const value of editChannels) {
        const channel = await Application.getClient().channels.fetch(value.channelid) as TextChannel;
        let newTimeIndex = this.time.indexOf(channel.rateLimitPerUser) - 1
        if(newTimeIndex <= 0) {
          Logger.send('success', `Retour à la normal dans le salon ${ channel.name }, le slowmode a donc été désactivé.`)
          await channel.edit({rateLimitPerUser: this.time[newTimeIndex]})
          this.getChannelInfo(value.channelid)
          this.removeChannelFromList(value.channelid)
          return;
        }
        await channel.edit({rateLimitPerUser: this.time[newTimeIndex]})
        Logger.send('warn', `La moitié du nombre maximum de message dans le salon ${ channel.name } n'a pas été atteint, le slowmode a donc été réduit à ${ this.time[newTimeIndex] } secondes.`)
      }

      this.channelsInfo.forEach(value => this.setMessage(value.channelid));

    }, 60 * 1000)
  }

  public getChannelInfo(channelid: Snowflake) {
    let data = this.channelsInfo.filter(value => value.channelid = channelid)[0]
    if(!data) {
      this.channelsInfo.push({channelid: channelid, message: 0})
      data = this.channelsInfo.filter(value => value.channelid = channelid)[0]
    }
    return data
  }

  public increaseMessage(channelid: Snowflake) {
    this.getChannelInfo(channelid).message++;
  }

  public setMessage(channelid: Snowflake, count: number = 0) {
    this.getChannelInfo(channelid).message = count;
  }

  public removeChannelFromList(channelid: Snowflake) {
    this.channelsInfo = this.channelsInfo.filter(value => value.channelid !== channelid);
  }


}