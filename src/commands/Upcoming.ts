import { MinecraftBot } from "../bot/MinecraftBot";
import { MostRecentEvent } from "../MostRecentEvent";
import Command from "./Command";

export class Upcoming implements Command {
	bot: MinecraftBot;
	mostRecentEvent: MostRecentEvent;
	constructor(bot: MinecraftBot, mostRecentEvent: MostRecentEvent) {
		this.bot = bot;
		this.mostRecentEvent = mostRecentEvent;
	}
	isValid(command: string): boolean {
		return command === "upcoming" || command === "event";
	}
	process(
		command: string,
		args: string[],
		source: "minecraft" | "discord",
	): string | undefined {
		const header = this.bot.getTabHeader();
		const mostRecentString = this.mostRecentEvent.get();
		if (header === "") {
			if (mostRecentString === null || mostRecentString === "") {
				return `Unable to determine upcoming event`;
			} else {
				return `Most Recent Event was ${this.mostRecentEvent.get()}. Potential repeat after reset.`;
			}
		} else {
			return header;
		}
	}
}
