import { Event, BaseEvent } from 'ioc:factory/Core/Event'
import { Client, GuildChannel } from 'discord.js'
import { ConfigManager } from "App/defaults/ConfigManager";
import { Application } from "@sportek/core-next-sportek";

// @ts-ignore
@Event('fullReady')
export default class UpdateMemberCount extends BaseEvent {
  public async run(client: Client<true>): Promise<void> {
    setInterval(async () => {
      const config = ConfigManager.getBaseConfiguration().memberCount.channel
      const channel = await Application.getClient().channels.fetch(config) as unknown as GuildChannel;
      await channel.edit({name: ConfigManager.replaceToVariable(ConfigManager.getBaseConfiguration().memberCount.message, "memberCount", channel.guild.memberCount.toString())});
    }, 60 * 1000)
  }
}