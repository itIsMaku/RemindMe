import { MessageEmbed } from "discord.js";
import { registerCommand } from "../abstract/commands";
import fs from "fs";
import path from "path";

export const command = registerCommand(
    "reminds",
    "List all your reminders.",
    (slashCommandBuilder) => {
        return slashCommandBuilder;
    },
    (interaction) => {
        let storage = JSON.parse(
            fs.readFileSync(
                path.resolve(__dirname, "../../storage.json"),
                "utf-8"
            )
        );
        let reminders = storage.reminders;
        let userReminders = reminders.filter(
            (reminder: any) => reminder.user == interaction.user.id
        );

        const embed = new MessageEmbed()
            .setTitle("Your reminders | RemindMe")
            .setDescription(
                userReminders
                    .map(
                        (reminder: any) =>
                            `**${reminder.text}** - ${new Date(
                                reminder.now + reminder.end
                            ).toLocaleString()}`
                    )
                    .join("\n")
            )
            .setColor("#008080");

        interaction.reply({ embeds: [embed] });
    }
);
