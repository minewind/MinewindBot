import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { MinecraftBot } from "../bot/MinecraftBot";
import { DiscordBot } from "../discord/DiscordBot";
import { EventChannel, Users } from "../discord/servers";
import logger from "../Logger";
import { generateNLengthNumber } from "../util";

const COOLDOWN_SEC = 60;

export class Verifier {
	minecraftBot: MinecraftBot;
	discordBot: DiscordBot;
	// TODO: This will grow to takeup unlimited space. Need to implement
	// pruning/triming in the future.
	pendingVerifications: Map<string, PendingVerification> = new Map();

	constructor(minecraftBot: MinecraftBot, discordBot: DiscordBot) {
		this.minecraftBot = minecraftBot;
		this.discordBot = discordBot;
	}

	isValid(command: string): boolean {
		return command === "verify" || command === "confirm";
	}

	process(
		command: string,
		args: string[],
		source: "minecraft" | "discord",
		discordMessage: OmitPartialGroupDMChannel<Message<boolean>>,
	): string | undefined {
		if (command === "verify") {
			this.verify(args, discordMessage);
		} else if (command === "confirm") {
			this.confirm(args, discordMessage);
		} else {
			logger.error(`Unable to process invalid source: "${source}`);
		}
		return undefined;
	}

	verify(
		args: string[],
		discordMessage: OmitPartialGroupDMChannel<Message<boolean>>,
	) {
		const verificationCode = generateNLengthNumber(6);
		if (args.length < 1) {
			this.discordBot.send(
				"Missing IGN. Please use the format -verify <ign>. E.g., '-verify 21943second'",
				EventChannel.verify.channel_id,
				false,
			);
			return;
		}

		const proposedIGN = args[0].replace(/[^a-zA-Z0-9_]/g, "");
		const userId = discordMessage.author.id;
		const currentTime = Date.now();

		if (userId in this.pendingVerifications) {
			const pendingVerification: PendingVerification =
				this.pendingVerifications[userId];

			const secondsDelta: number =
				(currentTime - pendingVerification.updated_at) / 1000;

			if (secondsDelta < COOLDOWN_SEC) {
				this.discordBot.send(
					`Wait for ${Math.floor(COOLDOWN_SEC - secondsDelta)} seconds before attempting to verify again.`,
					EventChannel.verify.channel_id,
					false,
				);
				return;
			}
		}

		this.pendingVerifications[userId] = new PendingVerification(
			discordMessage,
			proposedIGN,
			verificationCode,
			currentTime,
		);

		this.discordBot.send(
			"Sent verification message in minecraft. Check it and reply here.",
			EventChannel.verify.channel_id,
			false,
		);

		this.minecraftBot.send(
			`/msg ${proposedIGN} Verification Code: ${verificationCode}. Please go to discord and -confirm <code>`,
		);
	}

	confirm(
		args: string[],
		discordMessage: OmitPartialGroupDMChannel<Message<boolean>>,
	) {
		logger.debug("Checking for confirmation");
		const userId = discordMessage.author.id;
		if (args.length < 1) {
		}
		const attemptedVerificationCode = args[0];
		if (!(userId in this.pendingVerifications)) {
			this.discordBot.send(
				"You do not have a pending verification. Run -verify to start.",
				EventChannel.verify.channel_id,
				false,
			);
			return;
		}
		const verification: PendingVerification = this.pendingVerifications[userId];
		if (attemptedVerificationCode !== verification.verification_code) {
			this.discordBot.send(
				"Invalid verification code",
				EventChannel.verify.channel_id,
				false,
			);
			return;
		}

		this.confirmUser(discordMessage);
		return;
	}

	private confirmUser(
		confirmMessage: OmitPartialGroupDMChannel<Message<boolean>>,
	) {
		const userId = confirmMessage.author.id;
		const verification: PendingVerification = this.pendingVerifications[userId];
		const verifyMessage = verification.discord_message;
		const member = verifyMessage.member;
		if (member === null) {
			logger.warn(
				`Unable to confirm null member: ${verifyMessage.author.globalName}`,
				verification,
				verifyMessage,
			);
			return;
		}
		member.roles
			.add(Users.verified_player.ping_group)
			.then((guildMember) => {
				logger.info(
					`Successfully verified ${verification.proposed_ign}`,
					verification,
				);
				member.setNickname(verification.proposed_ign);
				verifyMessage.react("✅");
				confirmMessage.react("✅");
				this.pendingVerifications.delete(userId);
			})
			.catch(() => {
				logger.warn(
					`Unable to confirm ${verifyMessage.author.globalName}`,
					verification,
				);
			});
	}
}

class PendingVerification {
	proposed_ign: string;
	verification_code: string;
	discord_message: OmitPartialGroupDMChannel<Message<boolean>>;
	updated_at: number;
	constructor(
		discord_message: OmitPartialGroupDMChannel<Message<boolean>>,
		proposed_ign: string,
		verification_code: string,
		updated_at: number,
	) {
		this.discord_message = discord_message;
		this.proposed_ign = proposed_ign;
		this.verification_code = verification_code;
		this.updated_at = updated_at;
	}
}
