export default interface Command {
	isValid(command: string): boolean;
	process(
		command: string,
		args: string[],
		source: "minecraft" | "discord",
	): string | undefined;
}
