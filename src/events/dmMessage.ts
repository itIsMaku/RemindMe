import { DMChannel } from "discord.js";
import { onEvent } from "../abstract/event";
import { helpEmbed } from "../app";

export const event = onEvent("messageCreate", (message) => {
    let channel = message.channel;
    if (!(channel instanceof DMChannel)) return;
    if (message.author.bot) return;

    channel.send({ embeds: [helpEmbed] });
});
