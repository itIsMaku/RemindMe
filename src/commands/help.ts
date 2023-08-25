import { registerCommand } from "../abstract/commands";
import { helpEmbed } from "../app";

export const command = registerCommand(
    "help",
    "Information about the bot and its commands.",
    (slashCommandBuilder) => {
        return slashCommandBuilder;
    },
    (interaction) => {
        interaction.reply({ embeds: [helpEmbed] });
    }
);
