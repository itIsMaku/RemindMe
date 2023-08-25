import { Client, ClientEvents } from "discord.js";
import { client } from "../app";
import { Awaitable } from "discordx";
import fs from "fs";
import path from "path";
import logger from "../utils/logger";

export function onEvent<K extends keyof ClientEvents>(
    name: K,
    callback: (...args: ClientEvents[K]) => Awaitable<void>
) {
    return client.on(name, callback);
}

const funcs: Client[] = [];
const files = fs
    .readdirSync(path.resolve(__dirname, "../events"))
    .filter((file) => file.endsWith(".ts"));

export function registerEvents() {
    for (const file of files) {
        const eventFile = require(`../events/${file}`);
        eventFile.event;
        logger.info(`Bot | Registered ${file} event handler.`);
    }
}
