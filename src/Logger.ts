import winston, { format } from "winston";

const logger = winston.createLogger({
	level: "info",
	format: winston.format.json(),
	defaultMeta: { service: "user-service" },
	transports: [
		new winston.transports.File({
			filename: "error.log",
			level: "warn",
			format: format.combine(format.timestamp(), format.json()),
		}),
		new winston.transports.File({
			filename: "combined.log",
			level: "debug",
			format: format.combine(format.timestamp(), format.json()),
		}),
	],
});

// I just need logging rn
if (process.env.NODE_ENV !== "production" || true) {
	logger.add(
		new winston.transports.Console({
			format: winston.format.simple(),
			level: "debug",
		}),
	);
}

export default logger;
