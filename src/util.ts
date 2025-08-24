import dotenv from "dotenv";

dotenv.config();

import fetch from "node-fetch";
import logger from "./Logger";

export function flatten(arg: object): string {
	if (Array.isArray(arg)) {
		return arg.map((x) => flatten(x)).join("");
	}
	if (typeof arg === "string" || arg instanceof String) {
		return arg as string;
	}
	let out = "";
	if ("json" in arg) {
		out += flatten(arg["json"] || "");
	}
	if ("text" in arg) {
		out += arg["text"] || "";
	}
	if ("extra" in arg) {
		out += flatten(arg["extra"] || "");
	}
	out += arg[""] || "";
	return out;
}

export function clean(message: string): string {
	message = message.replace(/§[a-zA-Z0-9]/gm, "");
	return message;
}

export function toCleanText(message): string {
	let flatMessage = flatten(message) || "";
	let cleanedMessage = clean(flatMessage);
	return cleanedMessage;
}

export function ping(role_id: string) {
	return `<@&${role_id}>`;
}

export function pingUser(user_id: string) {
	return `<@${user_id}>`;
}

export async function manualSend(message: string, channelId: string) {
	const response = await fetch(
		`https://discord.com/api/channels/${channelId}/messages`,
		{
			method: "POST",
			headers: {
				Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				content: message,
			}),
		},
	);
	logger.debug(
		`Manual message "${message}" received ${response.status}-${response.statusText}`,
	);
}

export function breakLinks(message: string): string {
	return message.replace(/(?<=[A-Za-z0-9])\.(?=[A-Za-z])/gi, "(.)");
}

export function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function unspaceAndLowercase(message: string): string {
	return message.toLocaleLowerCase().replace(/ /g, "");
}
