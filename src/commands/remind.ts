import { registerCommand } from "../abstract/commands";
import fs from "fs";
import path from "path";

export const command = registerCommand(
    "remind",
    "Remind me about something in a given time.",
    (slashCommandBuilder) => {
        slashCommandBuilder.addStringOption((option) =>
            option
                .setName("text")
                .setDescription("What do you want to be reminded about?")
                .setRequired(true)
        );
        slashCommandBuilder.addStringOption((option) =>
            option
                .setName("time")
                .setDescription(
                    "When do you want to be reminded? (e.g. 1h, 30m, 1d)"
                )
                .setRequired(true)
        );
        return slashCommandBuilder;
    },
    (interaction) => {
        const text = interaction.options.getString("text");
        const time = interaction.options.getString("time");
        if (text == null || time == null) {
            interaction.reply("Something went wrong.");
            return;
        }
        // write to storage.json
        const storage = JSON.parse(
            fs.readFileSync(
                path.resolve(__dirname, "../../storage.json"),
                "utf-8"
            )
        );
        let end = 0;
        if (time.endsWith("h")) {
            end = parseInt(time.substring(0, time.length - 1)) * 60 * 60 * 1000;
        } else if (time.endsWith("m")) {
            end = parseInt(time.substring(0, time.length - 1)) * 60 * 1000;
        } else if (time.endsWith("d")) {
            end =
                parseInt(time.substring(0, time.length - 1)) *
                24 *
                60 *
                60 *
                1000;
        } else if (time.endsWith("s")) {
            end = parseInt(time) * 1000;
        } else {
            interaction.reply(
                "Time must be defined in hours, minutes, days or seconds."
            );
            return;
        }
        storage.reminders.push({
            text: text,
            end: end,
            user: interaction.user.id,
            now: Date.now(),
        });
        fs.writeFileSync(
            path.resolve(__dirname, "../../storage.json"),
            JSON.stringify(storage)
        );
        interaction.reply(
            `I will remind you about **${text}** in **${time}**!`
        );
    }
);
