import Command from "./Command";

export class Help implements Command {
	isValid(command: string): boolean {
		return command === "help";
	}
	process(
		command: string,
		args: string[],
		source: "minecraft" | "discord",
	): string | undefined {
		const essMsg = "-pc (ess name) (tier). Pc *only* works for essences";
		if (source === "minecraft") {
			return `I currently support 3 commands: -help, -upcoming, and ${essMsg}`;
		} else if (source === "discord") {
			return `I currently support: -help, -players, -upcoming, and ${essMsg}`;
		} else {
			throw new Error(`Unindentified source: ${source}`);
		}
	}
}
