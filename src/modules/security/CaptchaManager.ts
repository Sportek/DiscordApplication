import { createCanvas } from "canvas";
import fs from "fs";
import { getFonts } from "font-list";
import { getRandomNumberBetweenTwoNotFloored } from "App/defaults/MathUtils";
import {
  GuildMember,
  MessageActionRow,
  MessageButton,
  MessageOptions,
  MessagePayload,
  Snowflake,
  TextChannel
} from "discord.js";
import { ConfigManager } from "App/defaults/ConfigManager";
import { getDefaultEmbed } from "App/defaults/MessageManager";


export class CaptchaManager {

  private _list: { userid: string, code: string, timestamp: number }[] = [];
  private _messages: {userid: string, messageid: string }[] = [];


  private static $instance: CaptchaManager;
  public fonts: string[];

  public static getInstance() {
    if(!this.$instance) {
      this.$instance = new CaptchaManager();
    }
    return this.$instance
  }


  get list(): { userid: string; code: string, timestamp: number }[] {
    return this._list;
  }

  public setList(value: { userid: string; code: string; timestamp: number }[]) {
    this._list = value;
  }

  get messages(): { userid: string; messageid: string }[] {
    return this._messages;
  }


  public setMessages(value: { userid: string; messageid: string }[]) {
    this._messages = value;
  }

  public getPlayerList(userid: Snowflake) {
    return this.list.filter(value => value.userid === userid);
  }

  public getPlayerListFromMessage(userid: Snowflake) {
    return this.messages.filter(value => value.userid === userid)
  }

  public removePlayerFromList(userid: Snowflake){
    const list = this.list.filter(value => value.userid !== userid)
    this.setList(list)


    const message = this.messages.filter(value => value.userid !== userid);
    this.setMessages(message)

  }

  public async checkIfFonts() {
    if(!this.fonts) {
      this.fonts = ["Gadugi", "Georgia", "Gill Sans Ultra Bold", "Candara", "Century", "Cambria", "Impact", "Anton", "Arial", "Bahnschrift"]
    }
  }

  private async getRandomFont() {
    await this.checkIfFonts()
    return this.fonts[Math.floor(Math.random() * this.fonts.length)];
  }

  private static generateCode() {
    const amount = 6;
    let code = ""

    const chars: string[] = ["a", "b", "d", "e", "f", "g", "h", "i", "j", "k", "m", "n", "q", "r", "t", "u", "x", "y",
      "A", "B", "D", "E", "F", "G", "H", "J", "K", "M", "N", "Q", "R", "T", "U", "X", "Y", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    for (let i = 0; i < amount; i++) {
      code += chars[Math.floor(Math.random() * chars.length)]
    }
    return code;
  }

  public async sendMessage(member: GuildMember, enable: boolean) {
    const guild = member.guild;
    const channel = await guild.channels.fetch(ConfigManager.getSecurityConfiguration().channelID) as TextChannel;
    const row = new MessageActionRow()
      .addComponents(new MessageButton().setCustomId('incorrect-captcha').setLabel("Reset le captcha").setStyle("PRIMARY").setEmoji("⁉").setDisabled(enable))
    const embed = getDefaultEmbed("Captcha")
      .setImage(`attachment://${ member.id }.png`)
      .setTitle(`Système de Captcha`)
      .setDescription(`Vous devez résoudre le captcha suivant pour avoir accès à l'ensemble du serveur. Celui-ci est composé de 6 lettres ou chiffre que vous devez écrire sans espace de gauche à droite. Dans le cas où certains caractères sont non reconnaissables, vous pouvez réinitialiser le captcha en appuyant sur le bouton ci-dessous.`)
      .setFooter(member.id)
    return {
      embeds: [embed],
      content: `Bonjour ${member},`,
      files: [{attachment: `./security/${ member.id }.png`, name: `${ member.id }.png`}],
      components: [row]
    } as string | MessagePayload | MessageOptions
  }


  public async generateCanvas(userID: Snowflake) {

    const code = CaptchaManager.generateCode();
    this.list.push({userid: userID, code: code, timestamp: Date.now()})
    console.log(code)
    console.log("code pushed")
    const width = 400
    const height = 200
    const color = "#000"

    const {createCanvas, loadImage} = require("canvas");
    const codeArray: string[] = Array.from(code);
    const canvas = createCanvas(width, height);
    const percentage = 100 / codeArray.length / 100 * 0.85;
    const ctx = canvas.getContext('2d');
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#bfbfbf";
    ctx.beginPath();
    ctx.fillRect(0, 0, width, height);
    ctx.save();

    let index = 20;
    for (let string of codeArray) {
      const ctx = canvas.getContext('2d');
      ctx.font = `60px ${ await this.getRandomFont() }`
      ctx.save()
      ctx.rotate(getRandomNumberBetweenTwoNotFloored(0, 0.2))
      ctx.fillStyle = color
      ctx.fillText(string, index, height / 1.7)
      ctx.restore()
      index += percentage * width

    }
    fs.writeFileSync(`./security/${ userID }.png`, canvas.toBuffer());
  }
}