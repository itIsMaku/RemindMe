import fs from "fs";
import path from "path";
import logger from "./utils/logger";
import { client } from "./app";

export async function worker() {
    logger.info("Worker | Worker is running.");
    setInterval(() => {
        let storage = JSON.parse(
            fs.readFileSync(path.resolve(__dirname, "../storage.json"), "utf-8")
        );
        let reminders = storage.reminders;
        for (let i = 0; i < reminders.length; i++) {
            const reminder = reminders[i];
            if (reminder.now + reminder.end < Date.now()) {
                reminders.splice(i, 1);
                fs.writeFileSync(
                    path.resolve(__dirname, "../storage.json"),
                    JSON.stringify(storage)
                );
                let user = client.users.resolve(reminder.user);
                if (user == null) {
                    logger.info(
                        `Worker | Could not find user ${reminder.user}. Terminating sending remind.`
                    );
                    return;
                }
                user.send(
                    `You asked me to remind you about **${reminder.text}**.`
                );
                logger.info(
                    `Worker | Reminded ${reminder.user} about ${reminder.text}.`
                );
            }
        }
    }, 1000);
}
