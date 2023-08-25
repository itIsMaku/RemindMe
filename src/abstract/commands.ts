import { REST } from "@discordjs/rest";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Routes } from "discord-api-types/v10";
import config from "../../config.json";
import logger from "../utils/logger";
import fs from "fs";
import { client } from "../app";
import { CacheType, CommandInteraction } from "discord.js";
import path from "path";

const commands: any[] = [];
const commandFiles = fs
    .readdirSync(path.resolve(__dirname, "../commands"))
    .filter((file) => file.endsWith(".ts"));

const rest = new REST({ version: "10" }).setToken(config.bot.token);

function registerCommands() {
    for (const file of commandFiles) {
        const commandFile = require(`../commands/${file}`);
        commands.push(commandFile.command.toJSON());
        logger.info(`Bot | Registered ${file} command handler.`);
    }
    refreshCommands();
}

async function refreshCommands() {
    try {
        logger.info("Commands | Refreshing slash commands...");

        await rest.put(Routes.applicationCommands(config.bot.client_id), {
            body: commands,
        });

        logger.info("Commands | Reloaded slash commands.");
    } catch (error) {
        logger.error(`An unexpected error occured: ${error}`);
    }
}

type Fun<T> = (t: T) => void;
type ApplyFun<A, B> = (t: A) => B;

function registerCommand(
    name: string,
    description: string,
    defineSlashCommand: ApplyFun<
        SlashCommandBuilder,
        SlashCommandBuilder | null
    >,
    interactionAction: Fun<CommandInteraction<CacheType>>
) {
    let data = new SlashCommandBuilder()
        .setName(name)
        .setDescription(description);
    let newData = defineSlashCommand(data);
    if (newData != null) {
        data = newData;
    }
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) return;

        if (interaction.commandName === name) {
            interactionAction(interaction);
        }
    });
    return data;
}

export { refreshCommands, registerCommand, registerCommands };
