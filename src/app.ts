import { Intents, MessageEmbed } from "discord.js";
import { Client } from "discordx";
import config from "../config.json";
import logger from "./utils/logger";
import { registerEvents } from "./abstract/event";
import { registerCommands } from "./abstract/commands";
import { worker } from "./worker";

export const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.DIRECT_MESSAGES,
    ],
});

export const helpEmbed = new MessageEmbed()
    .setTitle("Help | RemindMe")
    .setDescription(
        `Hello! I'm RemindMe, a bot that can remind you about something in a given time. To get started, use \`/remind\` in a server I'm in or in our direct message.`
    )
    .addFields(
        {
            name: "Commands",
            value: `\`/remind\` - Remind me about something in a given time.\n\`/reminds\` - List all your reminders.`,
        },
        {
            name: "Support",
            value: `If you need help, join our [support server](https://discord.gg).`,
        }
    )
    .setColor("#008080");

client.on("ready", async () => {
    await client.initApplicationCommands();
    registerCommands();
    registerEvents();

    logger.info("Bot | Successfully started.");

    worker();
});

client.login(config.bot.token);
