import { getDefaultEmbed } from "App/defaults/MessageManager";
import { Message } from "discord.js";

export class ManageEditableMessage {

  getMessageContent(embed: boolean, title: string | null, message: Message) {
    if (embed) {
        const embed = getDefaultEmbed("Utilitaires");
        if(title) embed.setTitle(title)
        if (message.content) embed.setDescription(message.content)
        if (message.attachments) {
            message.attachments.forEach(value => {
                if (value.contentType?.startsWith("image")) {
                    embed.setImage(value.proxyURL)
                }
            })
        }
        return {embeds: [embed]}
    } else {
        let attach = []
        message.attachments.forEach(value => {
            if (value) { // @ts-ignore
                attach.push(value.attachment)
            }
        })

        if (!message.content) {
            return {
                files: attach,
                components: message.components
            }
        } else {
            return {
                content: message.content,
                files: attach,
                components: message.components
            }
        }
    }
  }
}