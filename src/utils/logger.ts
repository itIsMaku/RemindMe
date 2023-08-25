import { gray } from "colors";
import { createLogger, format, transports } from "winston";

export const logger = createLogger({
    transports: [
        new transports.Console({
            format: format.combine(
                format.timestamp(),
                format.colorize(),
                format.printf(
                    ({ level, message, timestamp }) =>
                        `(${level}) ${gray(timestamp)}  ${message}`
                )
            ),
            handleExceptions: true,
        }),
    ],
});

export default logger;
