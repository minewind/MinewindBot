import { MinecraftBot } from "src/bot/MinecraftBot";
import Command from "./Command";

export class Players implements Command {
	bot: MinecraftBot;
	constructor(bot: MinecraftBot) {
		this.bot = bot;
	}
	isValid(command: string): boolean {
		return command === "players";
	}
	process(
		command: string,
		args: string[],
		source: "minecraft" | "discord",
	): string | undefined {
		return this.bot.getPlayerList().join("\n");
	}
}
