//const dotenv = require("dotenv");

import dotenv from "dotenv";

dotenv.config();

import mineflayer, { type Bot } from "mineflayer";
import type { ChatMessage } from "prismarine-chat";
import logger from "../Logger";
import { breakLinks, toCleanText } from "../util";
// const mineflayer = require("mineflayer");

export type ChatEventHandler = (username: string, message: string) => boolean;
export type MessageEventHandler = (
	jsonMsg: ChatMessage,
	position: string,
) => boolean;

export class MinecraftBot {
	cooldown: number = 1;
	bot!: Bot; /// Interesting typescript workaround
	messageEventHandlers: MessageEventHandler[] = [];
	recentGreetings: string[] = [];

	constructor() {
		this.init();
	}
	init() {
		const ip =
			process.env.NODE_ENV === "production"
				? process.env.MINECRAFT_IP
				: "localhost";
		this.bot = mineflayer.createBot({
			host: ip, // minecraft server ip
			username: process.env.MINECRAFT_USERNAME, // username to join as if auth is `offline`, else a unique identifier for this account. Switch if you want to change accounts
			auth: "microsoft", // for offline mode servers, you can set this to 'offline'
			version: process.env.MINECRAFT_VERSION, // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
		});

		this.bot.on("message", (jsonMsg: ChatMessage, position: string) => {
			try {
				const cleaned = toCleanText(jsonMsg.json);
				if (cleaned.startsWith("Welcome ")) {
					if (this.recentGreetings.includes(cleaned)) {
						return;
					} else {
						this.recentGreetings.unshift(cleaned);
					}
					if (this.recentGreetings.length >= 20) this.recentGreetings.pop();
				}
				for (let i = 0; i < this.messageEventHandlers.length; i++) {
					const result = this.messageEventHandlers[i](jsonMsg, position);
					if (result === true) {
						break;
					}
				}
			} catch (error: any) {
				const nodeError: NodeJS.ErrnoException = error;
				logger.error(`Minecraft Chat Error`, nodeError);
			}
		});

		// Log errors and kick reasons:
		this.bot.on("kicked", (e) => {
			logger.warn(`Bot has been kicked`, e);
		});
		this.bot.on("error", (e) => {
			logger.error(`Bot has encountered an error`, {
				cause: e.cause,
				message: e.message,
				name: e.name,
				stack: e.stack,
			});
		});

		this.bot.once("end", (e) => {
			logger.error(`End event triggered due to ${e}. Re-attempting init`);
			this.init();
		});
	}

	registerMessageEvent(eventHandler: MessageEventHandler): void {
		this.messageEventHandlers.push(eventHandler);
	}

	unsafeSend(message: string): void {
		this.bot.chat(message);
	}

	send(message: string): void {
		message = breakLinks(message);
		message = message.slice(0, 256);
		this.bot.chat(message);
	}

	getPlayerList(): string[] {
		return Object.keys(this.bot.players);
	}
}
