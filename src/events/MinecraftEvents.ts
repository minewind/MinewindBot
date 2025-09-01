import { codeBlock, escapeCodeBlock } from 'discord.js';
import { BaseMessageEvent, PingableEvent } from '../MessageEvent';
import { config } from '../Config';
import { breakLinks } from '../util';


export class WelcomeEvent extends BaseMessageEvent {
  constructor(message: string) { super(message); this.name = 'welcome'; this.channel = config.mainServer.channels.welcome; }
  static isValid(message: string): boolean { return /^Welcome [a-zA-Z0-9_]{2,16}!$/.test(message); }
}

export class VoteEvent extends BaseMessageEvent {
  constructor(message: string) { super(message); this.name = 'vote'; this.channel = config.mainServer.channels.events; }
  static isValid(message: string): boolean { return /^\/vote -> ([a-zA-Z0-9_]{2,16}): (.*)$/.test(message); }
}

export class SharpeningEvent extends BaseMessageEvent {
  constructor(message: string) { super(message); this.name = 'sharpening'; this.channel = config.mainServer.channels.sharpening; }
  static isValid(message: string): boolean { return /^([a-zA-Z0-9_]{2,16}) sharpened (.*) to \+(\d+)!$/.test(message); }
}

export class SystemEvent extends BaseMessageEvent {
  constructor(message: string) { super(message); this.name = 'system'; this.channel = config.mainServer.channels.debug; }
  static isValid(message: string): boolean {
    const regexes = [/^Your \/chatlevel is \w+$/, /^You have (\d+ )?new mail. Try \/claim$/, /^You have \d+ rewards? to \/claim$/, /^Visit Minewind\.com for News and Information$/, /^Have an idea to better the server\? Minewind\.com\/feedback$/, /^Report bugs at Minewind\.com\/bugs$/];
    return regexes.some(r => r.test(message));
  }
}


// Snovasion
export class SnovasionStartEvent extends PingableEvent {
  constructor(message: string) { super(message, config.mainServer.roles.snovasion, config.mainServer.roles.general); this.name = 'snovasion-start'; this.channel = config.mainServer.channels.snovasion; }
  static isValid(message: string): boolean { return /^(Snovasion Event begins in (1 hour|\d+ minutes?|\d+ seconds?)\.|Snowmen invade \/pvp!)/.test(message); }
}
export class SnovasionEndEvent extends BaseMessageEvent {
  constructor(message: string) { super(message); this.name = 'snovasion-end'; this.channel = config.mainServer.channels.snovasion; }
  static isValid(message: string): boolean { return /^Snowmen melt away!$/.test(message); }
}

// Labyrinth
export class LabyrinthStartEvent extends PingableEvent {
  constructor(message: string) { super(message, config.mainServer.roles.labyrinth, config.mainServer.roles.general); this.name = 'labyrinth-start'; this.channel = config.mainServer.channels.labyrinth; }
  static isValid(message: string): boolean { return /^Labyrinth event (begins in (1 hour|\d+ minutes?|\d+ seconds?)\.|is starting\.\.\.|has started!)$/i.test(message); }
}
export class LabyrinthEndEvent extends BaseMessageEvent {
  constructor(message: string) { super(message); this.name = 'labyrinth-end'; this.channel = config.mainServer.channels.labyrinth; }
  static isValid(message: string): boolean { return /^Labyrinth event has ended!$/i.test(message); }
}

// Beef
export class BeefStartEvent extends PingableEvent {
  constructor(message: string) { super(message, config.mainServer.roles.beef, config.mainServer.roles.general); this.name = 'beef-start'; this.channel = config.mainServer.channels.beef; }
  static isValid(message: string): boolean { return /^Beef (Event (begins in (1 hour|\d+ minutes?|\d+ seconds?))\.|has started!)$/i.test(message); }
}
export class BeefEndEvent extends BaseMessageEvent {
  constructor(message: string) { super(message); this.name = 'beef-end'; this.channel = config.mainServer.channels.beef; }
  static isValid(message: string): boolean { return /^Team (aqua|red) wins the beef event!$/i.test(message); }
}

// Abyssal
export class AbyssalStartEvent extends PingableEvent {
  constructor(message: string) { super(message, config.mainServer.roles.abyssal, config.mainServer.roles.general); this.name = 'abyssal-start'; this.channel = config.mainServer.channels.abyssal; }
  static isValid(message: string): boolean { return /^Abyssal event (begins in (1 hour|\d+ minutes?|\d+ seconds?)\.|has started!)$/.test(message); }
}
export class AbyssalEndEvent extends BaseMessageEvent {
  constructor(message: string) { super(message); this.name = 'abyssal-end'; this.channel = config.mainServer.channels.abyssal; }
  static isValid(message: string): boolean { return /^[a-zA-Z0-9_]{2,16} wins the abyssal event! Poseidon is pleased!$/i.test(message); }
  generateDiscordMessage(): string { return codeBlock(`${this.message} - 1s, 2 abyssal keys, 1 fmb, 64 gaps, 64 gold coins`); }
}

// Attack on Giant
export class AttackOnGiantStartEvent extends PingableEvent {
  constructor(message: string) { super(message, config.mainServer.roles.attack_on_giant, config.mainServer.roles.general); this.name = 'aog-start'; this.channel = config.mainServer.channels.attack_on_giant; }
  static isValid(message: string): boolean { return /^Attack on Giant Event (begins in (1 hour|\d+ minutes?|\d+ seconds?)\.|has begun!)$/i.test(message); }
}
export class AttackOnGiantEndEvent extends BaseMessageEvent {
  constructor(message: string) { super(message); this.name = 'aog-end'; this.channel = config.mainServer.channels.attack_on_giant; }
  static isValid(message: string): boolean { return /^Attack on Giant Event ends!$/i.test(message); }
}

// Fox Hunt
export class FoxHuntStartEvent extends PingableEvent {
  constructor(message: string) { super(message, config.mainServer.roles.fox_hunt, config.mainServer.roles.general); this.name = 'fox-start'; this.channel = config.mainServer.channels.fox_hunt; }
  static isValid(message: string): boolean { return /^Fox Hunt (Event )?(begins in (1 hour|\d+ minutes?|\d+ seconds?)\.|has begun!)$/i.test(message); }
}
export class FoxHuntEndEvent extends BaseMessageEvent {
  constructor(message: string) { super(message); this.name = 'fox-end'; this.channel = config.mainServer.channels.fox_hunt; }
  static isValid(message: string): boolean { return /^Fox Hunt event ends!$/i.test(message); }
}
export class FoxHuntLeaderboardEvent extends BaseMessageEvent {
    constructor(message: string) { super(message); this.name = 'fox-leaderboard'; this.channel = config.mainServer.channels.fox_hunt; }
    static isValid(message: string): boolean { return /^[123]\) [a-zA-Z0-9_]{2,16} -- \d+ foxes$/i.test(message); }
    generateDiscordMessage(): string {
        if (this.message.startsWith('1)')) return codeBlock(`${this.message} - 52 deggs, 1 forbidden cacao beans`);
        if (this.message.startsWith('2)')) return codeBlock(`${this.message} - 42 deggs`);
        if (this.message.startsWith('3)')) return codeBlock(`${this.message} - 32 deggs`);
        return super.generateDiscordMessage();
    }
}

// Bait
export class BaitStartEvent extends PingableEvent {
    constructor(message: string) { super(message, config.mainServer.roles.bait, config.mainServer.roles.general); this.name = 'bait-start'; this.channel = config.mainServer.channels.bait; }
    static isValid(message: string): boolean { return /^Bait Event (begins in (1 hour|\d+ minutes?|\d+ seconds?)\.|has started!)$/i.test(message); }
}
export class BaitEndEvent extends BaseMessageEvent {
    constructor(message: string) { super(message); this.name = 'bait-end'; this.channel = config.mainServer.channels.bait; }
    static isValid(message: string): boolean { return /^Fishing event ends!$/i.test(message); }
}
export class BaitLeaderboardEvent extends BaseMessageEvent {
    constructor(message: string) { super(message); this.name = 'bait-leaderboard'; this.channel = config.mainServer.channels.bait; }
    static isValid(message: string): boolean { return /^[123]\) [a-zA-Z0-9_]{2,16} -- \d+ fish$/i.test(message); }
}

// Castle
export class CastleStartEvent extends PingableEvent {
    constructor(message: string) { super(message, config.mainServer.roles.castle, config.mainServer.roles.general); this.name = 'castle-start'; this.channel = config.mainServer.channels.castle; }
    static isValid(message: string): boolean { return /^Battle for Minewind (begins in (1 hour|\d+ minutes?|\d+ seconds?)\.|has started!?|has begun!?)\.?/i.test(message); }
}
export class CastleControlEvent extends BaseMessageEvent {
    constructor(message: string) { super(message); this.name = 'castle-control'; this.channel = config.mainServer.channels.castle; }
    static isValid(message: string): boolean { return /hold the Minewind City!/i.test(message); }
}

// Team Death Match
export class TDMStartEvent extends PingableEvent {
    constructor(message: string) { super(message, config.mainServer.roles.tdm, config.mainServer.roles.general); this.name = 'tdm-start'; this.channel = config.mainServer.channels.tdm; }
    static isValid(message: string): boolean { return /^(Team)?( |-)?death( |-)?match (Event )?(begins in (1 hour|\d+ minutes?|\d+ seconds?)\.|has (begun|started))/i.test(message); }
}
export class TDMEndEvent extends BaseMessageEvent {
    constructor(message: string) { super(message); this.name = 'tdm-end'; this.channel = config.mainServer.channels.tdm; }
    static isValid(message: string): boolean { return /^(Team)?( |-)?death( |-)?match (event )?(ends|has ended).*$/i.test(message) || /^Team (aqua|red) wins the Team Deathmatch event!$/.test(message); }
}

// Free For All
export class FFAStartEvent extends PingableEvent {
    constructor(message: string) { super(message, config.mainServer.roles.ffa, config.mainServer.roles.general); this.name = 'ffa-start'; this.channel = config.mainServer.channels.ffa; }
    static isValid(message: string): boolean { return /^Free-For-All Event begins in (1 hour|\d+ minutes?|\d+ seconds?)\.$/i.test(message); }
}
export class FFAEndEvent extends BaseMessageEvent {
    constructor(message: string) { super(message); this.name = 'ffa-end'; this.channel = config.mainServer.channels.ffa; }
    static isValid(message: string): boolean { return /^Free-For-All event ends!$/i.test(message); }
}
export class FFALeaderboardEvent extends BaseMessageEvent {
    constructor(message: string) { super(message); this.name = 'ffa-leaderboard'; this.channel = config.mainServer.channels.ffa; }
    static isValid(message: string): boolean { return /^[123]\) [a-zA-Z0-9_]{2,16} -- \d+ kills$/.test(message); }
}


export class ChatEvent extends BaseMessageEvent {
    constructor(message: string) { super(message); this.name = 'chat'; this.channel = config.mainServer.channels.chat; }
    static isValid(message: string): boolean {
        const regexes = [/^(☘ )?([a-zA-Z0-9]{1,4}\.)?([a-zA-Z0-9❤_ ]{1,16}): .*$/, /^\* ([a-zA-z0-9_ ❤]{1,16}) (.*)$/];
        return regexes.some(r => r.test(message));
    }
    generateDiscordMessage(): string {
        const cleaned = escapeCodeBlock(breakLinks(this.message));
        if (this.message.includes(": >")) return codeBlock("diff", `+ ${cleaned}`);
        if (this.message.includes(": <")) return codeBlock("diff", `- ${cleaned}`);
        if (this.message.startsWith("* ")) return codeBlock("markdown", `# ${cleaned}`);
        return codeBlock(cleaned);
    }
}

export class DeathEvent extends BaseMessageEvent {
    constructor(message: string) { super(message); this.name = 'death'; this.channel = config.mainServer.channels.death; }
    static isValid(message: string): boolean {
        const regexes = [ /^[a-zA-Z0-9_]{2,16} is on RAMPAGE!+$/, /^[a-zA-Z0-9_]{2,16} died$/, /^[a-zA-Z0-9_]{2,16} starved to death$/, /^[a-zA-Z0-9_]{2,16} drowned( while trying to escape .*)?$/, /^[a-zA-Z0-9_]{2,16} blew up$/, /^[a-zA-Z0-9_]{2,16} self-disintegrated$/, /^[a-zA-Z0-9_]{2,16} was pricked to death$/, /^[a-zA-Z0-9_]{2,16} died to the void \(Death #\d+\)$/, /^[a-zA-Z0-9_]{2,16} went up in flames$/, /^[a-zA-Z0-9_]{2,16} fell off a ladder$/, /^[a-zA-Z0-9_]{2,16} burned to death$/, /^[a-zA-Z0-9_]{2,16} went off with a bang( due to a firework fired from .*)?$/, /^[a-zA-Z0-9_]{2,16} froze to death$/, /^[a-zA-Z0-9_]{2,16} lost \d+ fish as they teleported away$/, /^[a-zA-Z0-9_]{2,16} was frozen to death by .*$/, /^[a-zA-Z0-9_]{2,16} pwned [a-zA-Z0-9_]{2,16} for \d+!$/, /^[a-zA-Z0-9_]{2,16} rekt [a-zA-Z0-9_]{2,16} for \d+ fish$/, /^[a-zA-Z0-9_]{2,16} got \d+ (fish|kills) from [a-zA-Z0-9_]{2,16} as they ran away$/, /^[a-zA-Z0-9_]{2,16} lost \d+ (fish|kills) as they ran away$/, /^[a-zA-Z0-9_]{2,16} was stung to death$/, /^[a-zA-Z0-9_]{2,16} was obliterated by a sonically-charged shriek$/, /^[a-zA-Z0-9_]{2,16} was poked to death by a sweet berry bush( while trying to escape .*)?$/, /^[a-zA-Z0-9_]{2,16} was struck by lightning( while fighting .*)?$/, /^[a-zA-Z0-9_]{2,16} committed blood sacrifice$/, /^[a-zA-Z0-9_]{2,16} discovered the floor was lava$/, /^[a-zA-Z0-9_]{2,16} didn't want to live in the same world as .*$/, /^[a-zA-Z0-9_]{2,16} tried to swim in lava( to escape .*)?$/, /^[a-zA-Z0-9_]{2,16} withered away( while fighting .*)?$/, /^[a-zA-Z0-9_]{2,16} suffocated in a wall( while fighting .*)?$/, /^[a-zA-Z0-9_]{2,16} fell out of the world$/, /^[a-zA-Z0-9_]{2,16} fell off some vines$/, /^[a-zA-Z0-9_]{2,16} hit the ground too hard( while trying to escape .*)?$/, /^[a-zA-Z0-9_]{2,16} was killed by magic$/, /^[a-zA-Z0-9_]{2,16} was killed by .* while trying to hurt [a-zA-Z0-9_]{2,16}$/, /^[a-zA-Z0-9_]{2,16} was doomed to fall( by .*)?$/, /^[a-zA-Z0-9_]{2,16} was doomed to fall( because of .*)?$/, /^[a-zA-Z0-9_]{2,16} fell from a high place$/, /^[a-zA-Z0-9_]{2,16} rekt [a-zA-Z0-9_]{2,16} (using .*)?(for \d+ (kills))?(and got an? (double|TRIPLE|ULTRA) kill!)?$/i, /^[a-zA-Z0-9_]{2,16} was (killed|rekt|slain|shot|cursed|blown up|fireballed|fragged|zapped|zeused|lavaed|spirited away|Dragon Pounced|grug stomped|sparked|batted) by [a-zA-Z0-9_' ]{2,32}.*?$/, /^[a-zA-Z0-9_]{2,16} was impaled by [a-zA-Z0-9_' ]{2,32}( with .*)?$/, /^[a-zA-Z0-9_]{2,16} was rekt by [a-zA-Z0-9_]{2,16}'s (Elder Branch|Master Blaze) using .*$/, /^[a-zA-Z0-9_]{2,16} experienced kinetic energy( while trying to escape .*)?$/, /^[a-zA-Z0-9_]{2,16} died because of [a-zA-Z0-9_]{2,16}('s .*)?$/, /^[a-zA-Z0-9_]{2,16} sucked [a-zA-Z0-9_]{2,16} dry$/, /^[a-zA-Z0-9_]{2,16} borrowed soul of [a-zA-Z0-9_]{2,16}$/, /^[a-zA-Z0-9_]{2,16} beefed [a-zA-Z0-9_]{2,16} for \d+!$/, /^[a-zA-Z0-9_]{2,16} walked into the danger zone due to [a-zA-Z0-9_]{2,16}$/, /^[a-zA-Z0-9_]{2,16} was burned to a crisp while fighting .*$/, /^[a-zA-Z0-9_]{2,16} was killed by magic while trying to escape [a-zA-Z0-9_]{2,16}$/, /^[a-zA-Z0-9_]{2,16} was (forked|chickened|blown up) by [a-zA-Z0-9_]{2,16}$/, /^[a-zA-Z0-9_]{2,16} walked into fire while fighting (.*)?$/];
        return regexes.some(r => r.test(message));
    }
}
