import { codeBlock, escapeCodeBlock } from "discord.js";
import { EventChannel } from "./discord/servers";
import { breakLinks, ping } from "./util";

export abstract class BaseMessageEvent {
	static regexes: RegExp[];
	message: string;
	constructor(message: string) {
		this.message = message;
	}
	static isValid(message: string) {
		return this.regexes.some((regex) => regex.test(message));
	}
	generateDiscordMessage() {
		return codeBlock(escapeCodeBlock(this.message)).toString();
	}
}

export class VoteEvent extends BaseMessageEvent {
	static regexes = [/^\/vote -> ([a-zA-Z0-9_]{2,16}): (.*)$/];
	user: string;
	vote: string;
	constructor(message: string) {
		super(message);
		const match = message.match(VoteEvent.regexes[0]);
		this.user = match?.at(0)?.toString() || "";
		this.vote = match?.at(1)?.toString() || "";
	}
}

export class WelcomeEvent extends BaseMessageEvent {
	static regexes = [/^Welcome ([a-zA-Z0-9_]{2,16})!$/];
	user: string;
	constructor(message: string) {
		super(message);
		const match = message.match(WelcomeEvent.regexes[0]);
		this.user = match?.at(0)?.toString() || "";
	}
}

export class SystemEvent extends BaseMessageEvent {
	static regexes = [
		/^Your \/chatlevel is \w+$/,
		/^You have (\d+ )?new mail. Try \/claim$/,
		/^You have \d+ rewards? to \/claim$/,
		/^Visit Minewind\.com for News and Information$/,
		/^Have an idea to better the server\? Minewind\.com\/feedback$/,
		/^Report bugs at Minewind\.com\/bugs$/,
	];
}

export class SharpeningEvent extends BaseMessageEvent {
	static regexes = [/^([a-zA-Z0-9_]{2,16}) sharpened (.*) to \+(\d+)!$/];
	user: string;
	constructor(message: string) {
		super(message);
		const match = message.match(SharpeningEvent.regexes[0]);
		this.user = match?.at(0)?.toString() || "";
	}
}

export class SnovasionEvent extends BaseMessageEvent {
	static regexes = [
		/^(Snovasion Event begins in (1 hour|\d+ minutes?|\d+ seconds?)\.|Snowmen invade \/pvp!)/,
		/^Snowmen melt away!$/,
	];
	generateDiscordMessage(): string {
		if (SnovasionEvent.regexes[0].test(this.message)) {
			return `${this.message} ${ping(EventChannel.snovasion.ping_group)} ${ping(EventChannel.general.ping_group)}`;
		} else {
			return `${this.message}`;
		}
	}
}

export class LabyrinthEvent extends BaseMessageEvent {
	static regexes = [
		/^Labyrinth event begins in (1 hour|\d+ minutes?|\d+ seconds?)\.$/i,
		/^Labyrinth event (is starting\.\.\.|has started!)$/i,
		/^Labyrinth event has ended!$/i,
	];

	generateDiscordMessage(): string {
		if (
			LabyrinthEvent.regexes[0].test(this.message) ||
			LabyrinthEvent.regexes[1].test(this.message)
		) {
			return `${this.message} ${ping(EventChannel.labyrinth.ping_group)} ${ping(EventChannel.general.ping_group)}`;
		} else {
			return `${this.message}`;
		}
	}
}

export class BeefEvent extends BaseMessageEvent {
	static regexes = [
		/^Beef (Event (begins in (1 hour|\d+ minutes?|\d+ seconds?))\.|has started!)$/i,
		/^Team (aqua|red) wins the beef event!$/i,
	];

	generateDiscordMessage(): string {
		if (BeefEvent.regexes[0].test(this.message)) {
			return `${this.message} ${ping(EventChannel.beef.ping_group)} ${ping(EventChannel.general.ping_group)}`;
		} else {
			return `${this.message}`;
		}
	}
}

export class AbyssalEvent extends BaseMessageEvent {
	static regexes = [
		/^Abyssal event (begins in (1 hour|\d+ minutes?|\d+ seconds?)\.|has started!)$/,
		/^[a-zA-Z0-9_]{2,16} wins the abyssal event! Poseidon is pleased!$/i,
	];

	generateDiscordMessage(): string {
		if (AbyssalEvent.regexes[0].test(this.message)) {
			return `${this.message} ${ping(EventChannel.abyssal.ping_group)} ${ping(EventChannel.general.ping_group)}`;
		} else {
			return `${this.message} - 1s, 2 abyssal keys, 1 fmb, 64 gaps, 64 gold coins`;
		}
	}
}

export class AttackOnGiantEvent extends BaseMessageEvent {
	static regexes = [
		/^Attack on Giant Event (begins in (1 hour|\d+ minutes?|\d+ seconds?)\.|has begun!)$/i,
		/^Attack on Giant Event ends!$/i,
	];

	generateDiscordMessage(): string {
		if (AttackOnGiantEvent.regexes[0].test(this.message)) {
			return `${this.message} ${ping(EventChannel.attackongiant.ping_group)} ${ping(EventChannel.general.ping_group)}`;
		} else {
			return `${this.message}`;
		}
	}
}

export class FoxEvent extends BaseMessageEvent {
	static regexes = [
		/^Fox Hunt (Event )?(begins in (1 hour|\d+ minutes?|\d+ seconds?)\.|has begun!)$/i,
		/^1\) [a-zA-Z0-9_]{2,16} -- \d+ foxes$/i,
		/^2\) [a-zA-Z0-9_]{2,16} -- \d+ foxes$/i,
		/^3\) [a-zA-Z0-9_]{2,16} -- \d+ foxes$/i,
		/^Fox Hunt event ends!$/i,
	];

	generateDiscordMessage(): string {
		if (FoxEvent.regexes[0].test(this.message)) {
			return `${this.message} ${ping(EventChannel.fox.ping_group)} ${ping(EventChannel.general.ping_group)}`;
		} else if (FoxEvent.regexes[1].test(this.message)) {
			return `${this.message} - 52 deggs, 1 forbidden cacao beans`;
		} else if (FoxEvent.regexes[2].test(this.message)) {
			return `${this.message} - 42 deggs`;
		} else if (FoxEvent.regexes[3].test(this.message)) {
			return `${this.message} - 32 deggs`;
		} else {
			return `${this.message}`;
		}
	}
}

export class BaitEvent extends BaseMessageEvent {
	static regexes = [
		/^Bait Event (begins in (1 hour|\d+ minutes?|\d+ seconds?)\.|has started!)$/i,
		/^Fishing event ends!$/i,
		/^[123]\) [a-zA-Z0-9_]{2,16} -- \d+ fish$/i,
	];

	generateDiscordMessage(): string {
		if (BaitEvent.regexes[0].test(this.message)) {
			return `${this.message} ${ping(EventChannel.bait.ping_group)} ${ping(EventChannel.general.ping_group)}`;
		} else {
			return `${this.message}`;
		}
	}
}

export class CastleEvent extends BaseMessageEvent {
	static regexes = [
		/^Battle for Minewind (begins in (1 hour|\d+ minutes?|\d+ seconds?)\.)(\n.*)?$/i,
		/^Battle for Minewind (has started!?|has begun!?)\.?$/i,
		/^[a-zA-Z0-9 ]{1,64} \([a-zA-Z0-9]{1,4}\) hold the Minewind City!$/i,
		/^[a-zA-Z0-9 ]{1,64} \([a-zA-Z0-9]{1,4}\) take the Minewind City from hold the Minewind City from [a-zA-Z0-9 ]{1,64} \([a-zA-Z0-9]{1,4}\)!(.*\n.*)?$/i,
	];

	generateDiscordMessage(): string {
		if (CastleEvent.regexes[0].test(this.message)) {
			return `${this.message} ${ping(EventChannel.castle.ping_group)} ${ping(EventChannel.general.ping_group)}`;
		} else {
			return `${this.message}`;
		}
	}
}

export class TeamDeathMatchEvent extends BaseMessageEvent {
	static regexes = [
		/^(Team)?( |-)?death( |-)?match (Event )?begins in (1 hour|\d+ minutes?|\d+ seconds?)\.$/i,
		/^(Team)?( |-)?death( |-)?match (event )?has (begun|started).*$/,
		/^(Team)?( |-)?death( |-)?match (event )?(ends|has ended).*$/,
		/^Team (aqua|red) wins the Team Deathmatch event!$/,
	];
	generateDiscordMessage(): string {
		if (
			TeamDeathMatchEvent.regexes[0].test(this.message) ||
			TeamDeathMatchEvent.regexes[1].test(this.message)
		) {
			return `${this.message} ${ping(EventChannel.teamdeathmatch.ping_group)} ${ping(EventChannel.general.ping_group)}`;
		} else {
			return `${this.message}`;
		}
	}
}

export class FreeForAllEvent extends BaseMessageEvent {
	static regexes = [
		/^Free-For-All Event begins in (1 hour|\d+ minutes?|\d+ seconds?)\.$/i,
		/^Free-For-All event ends!$/i,
		/^[123]\) [a-zA-Z0-9_]{2,16} -- \d+ kills$/,
	];
	generateDiscordMessage(): string {
		if (FreeForAllEvent.regexes[0].test(this.message)) {
			return `${this.message} ${ping(EventChannel.freeforall.ping_group)} ${ping(EventChannel.general.ping_group)}`;
		} else {
			return `${this.message}`;
		}
	}
}

export class ChatEvent extends BaseMessageEvent {
	static regexes = [
		/^(☘ )?([a-zA-Z0-9]{1,4}\.)?([a-zA-Z0-9❤_ ]{1,16}): .*$/,
		/^\* ([a-zA-z0-9_ ❤]{1,16}) (.*)$/,
	];

	generateDiscordMessage(): string {
		if (this.message.includes(": >")) {
			return codeBlock("diff", `+${this.cleaned()}`);
		} else if (this.message.includes(": <")) {
			return codeBlock("diff", `-${this.cleaned()}`);
		} else if (this.message.startsWith("* ")) {
			return codeBlock("markdown", `#${this.cleaned()}`);
		} else {
			return codeBlock(this.cleaned());
		}
	}

	cleaned(): string {
		const cleaned =
			this.message.slice(0, 6) + breakLinks(this.message.slice(6));
		return escapeCodeBlock(cleaned);
	}

	getClanTag(): string | null {
		if (!ChatEvent.regexes[0].test(this.message)) {
			return null;
		}
		const match = this.message.match(ChatEvent.regexes[0]);
		if (match === null) {
			return null;
		}
		const tagWithDot = match[2];
		if (typeof tagWithDot === "undefined") {
			return null;
		}
		const tag = tagWithDot.slice(0, tagWithDot.length - 1);
		return tag;
	}

	getName(): string | null {
		if (!ChatEvent.regexes[0].test(this.message)) {
			return null;
		}
		const match = this.message.match(ChatEvent.regexes[0]);
		if (match === null) {
			return null;
		}
		return match[3];
	}
}

export class DebugEvent extends BaseMessageEvent {
	static regexes = [/.*/];
}

export class DeathEvent extends BaseMessageEvent {
	static regexes = [
		/^[a-zA-Z0-9_]{2,16} is on RAMPAGE!+$/,
		/^[a-zA-Z0-9_]{2,16} died$/,
		/^[a-zA-Z0-9_]{2,16} drowned$/,
		/^[a-zA-Z0-9_]{2,16} blew up$/,
		/^[a-zA-Z0-9_]{2,16} self-disintegrated$/,
		/^[a-zA-Z0-9_]{2,16} was pricked to death$/,
		/^[a-zA-Z0-9_]{2,16} died to the void \(Death #\d+\)$/,
		/^[a-zA-Z0-9_]{2,16} went up in flames$/,
		/^[a-zA-Z0-9_]{2,16} burned to death$/,
		/^[a-zA-Z0-9_]{2,16} went off with a bang( due to a firework fired from .*)?$/,
		/^[a-zA-Z0-9_]{2,16} froze to death$/,
		/^[a-zA-Z0-9_]{2,16} lost \d+ fish as they teleported away$/,
		/^[a-zA-Z0-9_]{2,16} was frozen to death by .*$/,
		/^[a-zA-Z0-9_]{2,16} pwned [a-zA-Z0-9_]{2,16} for \d+!$/,
		/^[a-zA-Z0-9_]{2,16} rekt [a-zA-Z0-9_]{2,16} for \d+ fish$/,
		/^[a-zA-Z0-9_]{2,16} got \d+ fish from [a-zA-Z0-9_]{2,16} as they ran away$/,
		/^[a-zA-Z0-9_]{2,16} lost \d+ fish as they ran away$/,
		/^[a-zA-Z0-9_]{2,16} was stung to death$/,
		/^[a-zA-Z0-9_]{2,16} was obliterated by a sonically-charged shriek$/,
		/^[a-zA-Z0-9_]{2,16} was poked to death by a sweet berry bush while trying to escape [a-zA-Z0-9_ ']{2,32}$/,
		/^[a-zA-Z0-9_]{2,16} was struck by lightning( while fighting .*)?$/,
		/^[a-zA-Z0-9_]{2,16} committed blood sacrifice$/,
		/^[a-zA-Z0-9_]{2,16} discovered the floor was lava$/,
		/^[a-zA-Z0-9_]{2,16} didn't want to live in the same world as .*$/,
		/^[a-zA-Z0-9_]{2,16} tried to swim in lava( to escape .*)?$/,
		/^[a-zA-Z0-9_]{2,16} withered away( while fighting .*)?$/,
		/^[a-zA-Z0-9_]{2,16} suffocated in a wall( while fighting .*)?$/,
		/^[a-zA-Z0-9_]{2,16} fell out of the world$/,
		/^[a-zA-Z0-9_]{2,16} hit the ground too hard( while trying to escape .*)?$/,
		/^[a-zA-Z0-9_]{2,16} was killed by magic$/,
		/^[a-zA-Z0-9_]{2,16} was killed by .* while trying to hurt [a-zA-Z0-9_]{2,16}$/,
		/^[a-zA-Z0-9_]{2,16} was doomed to fall( by [a-zA-Z0-9_ ]{2,32}( using .*)?)?$/,
		/^[a-zA-Z0-9_]{2,16} was doomed to fall( because of .*)?$/,
		/^[a-zA-Z0-9_]{2,16} fell from a high place$/,
		/^[a-zA-Z0-9_]{2,16} rekt [a-zA-Z0-9_]{2,16} (using .*)?(for \d+ (kills))?(and got an? (double|TRIPLE|ULTRA) kill!)?$/i,
		/^[a-zA-Z0-9_]{2,16} was (killed|rekt|slain|shot|cursed|blown up|fireballed|fragged|zapped|zeused|lavaed|spirited away|Dragon Pounced|grug stomped|sparked|batted) by [a-zA-Z0-9_' ]{2,32}.*?$/,
		/^[a-zA-Z0-9_]{2,16} was impaled by [a-zA-Z0-9_' ]{2,32}( with .*)?$/,
		/^[a-zA-Z0-9_]{2,16} was rekt by [a-zA-Z0-9_]{2,16}'s (Elder Branch|Master Blaze) using .*$/,
		/^[a-zA-Z0-9_]{2,16} experienced kinetic energy( while trying to escape .*)?$/,
		/^[a-zA-Z0-9_]{2,16} died because of [a-zA-Z0-9_]{2,16}('s .*)?$/,
		/^[a-zA-Z0-9_]{2,16} sucked [a-zA-Z0-9_]{2,16} dry$/,
		/^[a-zA-Z0-9_]{2,16} borrowed soul of [a-zA-Z0-9_]{2,16}$/,
		/^[a-zA-Z0-9_]{2,16} beefed [a-zA-Z0-9_]{2,16} for \d+!$/,
		/^[a-zA-Z0-9_]{2,16} walked into the danger zone due to [a-zA-Z0-9_]{2,16}$/,
		/^[a-zA-Z0-9_]{2,16} was burned to a crisp while fighting .*$/,
		/^[a-zA-Z0-9_]{2,16} was killed by magic while trying to escape [a-zA-Z0-9_]{2,16}$/,
		/^[a-zA-Z0-9_]{2,16} was (forked|chickened|blown up) by [a-zA-Z0-9_]{2,16}$/,
		/^[a-zA-Z0-9_]{2,16} walked into fire while fighting [a-zA-Z0-9_]{2,16}('s .*)?$/,
	];
}
