import Command from "./Command";

export class CommandManager {
	prefix: string = "-";
	config: CommandManagerConfig;

	constructor(config: CommandManagerConfig) {
		this.config = config;
	}

	process(
		message: string,
		source: "minecraft" | "discord",
	): string | undefined {
		if (!message.startsWith(this.prefix)) return;

		message = message.slice(this.prefix.length);
		const [commandString, ...args] = message.split(" ");

		for (const [command, mapping] of this.config) {
			if (!mapping.includes(source)) continue;
			if (command.isValid(commandString)) {
				return command.process(commandString, args, source);
			}
		}
	}
}

type Source = "minecraft" | "discord";
// Map command to being enabled or disable for a source (missing is considered disable)
export type CommandManagerConfig = Map<Command, Source[]>;

export class CommandManagerBuilder {
	config: Map<Command, Source[]>;
	mostRecent: Command | undefined;
	constructor() {
		this.config = new Map();
	}

	addCommand(command: Command, allowedSources: Source[]) {
		this.config.set(command, allowedSources);
		return this;
	}

	build(): CommandManager {
		return new CommandManager(this.config);
	}
}
