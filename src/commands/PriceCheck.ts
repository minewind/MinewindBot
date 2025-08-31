import { codeBlock, escapeCodeBlock } from "discord.js";
import { EssencePriceChecker } from "../bot/essences/EssencePriceChecker";
import { EventChannel } from "../discord/servers";
import { manualSend } from "../util";
import Command from "./Command";

export class PriceCheck implements Command {
	essencePriceChecker: EssencePriceChecker;

	constructor() {
		this.essencePriceChecker = new EssencePriceChecker();
	}
	isValid(command: string): boolean {
		return command === "pc";
	}
	process(
		command: string,
		args: string[],
		source: "minecraft" | "discord",
	): string | undefined {
		const result = this.essencePriceChecker.process(args);
		manualSend(
			codeBlock(
				`>>> ${escapeCodeBlock(args.join(" "))}\n<<< ${result || "undefined"}`,
			),
			EventChannel.debug.channel_id,
		);
		return result;
	}
}
