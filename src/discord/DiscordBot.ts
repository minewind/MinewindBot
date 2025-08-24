import {
	Client,
	codeBlock,
	Message,
	OmitPartialGroupDMChannel,
	TextChannel,
} from "discord.js";
import logger from "../Logger";
import { manualSend, pingUser } from "../util";
import { EventChannel, Users } from "./servers";

const { GatewayIntentBits } = require("discord.js");
const { MessageContent, GuildMessages, GuildMembers, Guilds } =
	GatewayIntentBits;

const dotenv = require("dotenv");

dotenv.config();

type ChatEventHandler = (
	message: OmitPartialGroupDMChannel<Message<boolean>>,
) => boolean;

export class DiscordBot {
	#messageQueue: Map<string, string[]> = new Map();
	client: Client;
	#messageEventHandlers: ChatEventHandler[] = [];

	constructor() {
		this.client = new Client({
			intents: [MessageContent, GuildMessages, GuildMembers, Guilds],
		});

		this.client.login(process.env.DISCORD_TOKEN);

		this.client.once("ready", (c) => {
			logger.info("Discord Bot Ready");
		});

		this.client.on("messageCreate", (message) => {
			if (message.author.id === this.client.user?.id) return;
			logger.info(`Discord Message: "${message}`);
			for (const handler of this.#messageEventHandlers) {
				const result = handler(message);
				if (result === true) {
					break;
				}
			}
		});
	}

	async send(
		message: string,
		channel_id: string,
		should_code_block: boolean = true,
	): Promise<void> {
		const channel = (await this.client.channels.fetch(
			channel_id,
		)) as TextChannel;

		const trimmedMessage = message.slice(0, 1900);
		const encodedMessage = should_code_block
			? codeBlock(trimmedMessage)
			: trimmedMessage;

		channel.send(encodedMessage).catch((reason) => {
			logger.warn(`Failed to send discord msg`, reason);
		});
	}

	registerMessageHandler(chatEventHandler: ChatEventHandler): void {
		this.#messageEventHandlers.push(chatEventHandler);
	}

	queue(message: string, channel: string): void {
		logger.debug(`Queueing "${message}... for ${channel}`);
		// This is bad and I blame typescript
		const currentQueue = this.#messageQueue.get(channel);
		if (currentQueue === undefined) {
			this.#messageQueue.set(channel, [message]);
		} else {
			currentQueue.push(message);
		}
	}

	flushAll(): void {
		logger.debug("Flushing All");
		this.#messageQueue.forEach(async (_messages, channelId) => {
			await this.flush(channelId);
		});
	}

	async flush(channelId: string) {
		logger.debug(`Flushing ${channelId}...`);
		const channel = (await this.client.channels.fetch(
			channelId,
		)) as TextChannel;
		const messages = this.#messageQueue.get(channelId);
		// Right away clear it out
		this.#messageQueue.delete(channelId);
		if (channel === null) {
			logger.warn(
				`Unable to find channel by id '${channelId}'. Discarding messages ${messages?.join(" ")}`,
			);
			return;
		}
		if (messages === undefined) {
			logger.warn(`Unable to find messages to send into '${channelId}'`);
			return;
		}

		// This ensures we stay below the 2,000 char limit on messages
		const filteredMessages = messages.filter(
			(message) => message.length < 2000,
		);

		let current = "";
		while (filteredMessages.length > 0) {
			current += `\n${filteredMessages.shift()}`;
			// If next add will push over 2000 chars, or this is the last message,
			// send the message
			if (
				`${current}\n${filteredMessages[0]}`.length > 2000 ||
				filteredMessages.length === 0
			) {
				channel.send(current).catch((res) => {
					logger.error(`Failed to send message to discord: "${current}"`, res);
					manualSend(
						`Failed to send a message to discord ${pingUser(Users.owner.ping_group)}`,
						EventChannel.logging.channel_id,
					);
				});
				current = "";
			}
		}
	}
}
