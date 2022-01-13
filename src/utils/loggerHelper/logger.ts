import * as winston from "winston";
import { allColors } from "winston/lib/winston/config";

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
};

const colors = {
	http: "blue",
	info: "green",
	warn: "yellow",
	error: "red",
	debug: "white",
};

const env = process.env.NODE_ENV;

const format = (): winston.Logform.Format => {
	return env === "production" ? prodFormat : devFormat;
};

winston.addColors(colors);

const devFormat = winston.format.combine(
	winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
	winston.format.colorize(allColors),
	winston.format.printf(
		(info) => `${info.timestamp} ${info.level}: ${info.message}`
	)
);

const prodFormat = winston.format.combine(
	winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
	winston.format.printf(
		(info) => `${info.timestamp} ${info.level}: ${info.message}`
	),
	winston.format.json()
);

const transports = [
	new winston.transports.Console(),
	new winston.transports.File({
		filename: "logs/error.log",
		level: "error",
	}),
];

export const logger = winston.createLogger({
	levels: levels,
	format: format(),
	transports: transports,
});
