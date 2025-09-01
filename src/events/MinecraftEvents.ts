import { BaseMessageEvent } from '../MessageEvent';
import { config } from '../Config';

export class PingableEvent extends BaseMessageEvent {
  private readonly roleIds: string[];

  constructor(message: string, ...roleIds: string[]) {
    super(message);
    this.roleIds = roleIds.filter(id => !!id); 
  }

  generateDiscordMessage(): string {
    const rolePings = this.roleIds.map(id => `<@&${id}>`).join(' ');
    return `${super.generateDiscordMessage()} ${rolePings}`;
  }
}

export class WelcomeEvent extends BaseMessageEvent {
  constructor(message: string) {
    super(message);
    this.name = 'welcome';
    this.channel = config.mainServer.channels.welcome;
  }
  static isValid(message: string): boolean {
    return message.includes('joined the game');
  }
}

export class VoteEvent extends BaseMessageEvent {
  constructor(message: string) {
    super(message);
    this.name = 'vote';
    this.channel = config.mainServer.channels.events;
  }
  static isValid(message: string): boolean {
    return message.includes('voted for the server');
  }
}

export class SnovasionEvent extends PingableEvent {
  constructor(message: string) {
    super(message, config.mainServer.roles.snovasion);
    this.name = 'snovasion';
    this.channel = config.mainServer.channels.snovasion;
  }
  static isValid(message: string): boolean {
    return message.includes('Snovasion');
  }
}

export class LabyrinthEvent extends PingableEvent {
  constructor(message: string) {
    super(message, config.mainServer.roles.labyrinth);
    this.name = 'labyrinth';
    this.channel = config.mainServer.channels.labyrinth;
  }
  static isValid(message: string): boolean {
    return message.includes('Labyrinth');
  }
}

export class BeefEvent extends PingableEvent {
    constructor(message: string) {
        super(message, config.mainServer.roles.beef);
        this.name = 'beef';
        this.channel = config.mainServer.channels.beef;
    }
    static isValid(message: string): boolean {
        return message.includes('beef');
    }
}

export class DragonEvent extends BaseMessageEvent {
    constructor(message: string) {
        super(message);
        this.name = 'dragon';
        this.channel = config.mainServer.channels.events;
    }
    static isValid(message: string): boolean {
        return message.includes('slain the dragon');
    }
}

export class DeatheffectEvent extends BaseMessageEvent {
    constructor(message: string) {
        super(message);
        this.name = 'deatheffect';
        this.channel = config.mainServer.channels.deatheffect;
    }
    static isValid(message: string): boolean {
        return message.includes('activated a deatheffect');
    }
}

export class GiveawayEvent extends BaseMessageEvent {
    constructor(message: string) {
        super(message);
        this.name = 'giveaway';
        this.channel = config.mainServer.channels.giveaway;
    }
    static isValid(message: string): boolean {
        return message.includes('is giving away');
    }
}

export class ResetEvent extends BaseMessageEvent {
    constructor(message: string) {
        super(message);
        this.name = 'reset';
        this.channel = config.mainServer.channels.resets;
    }
    static isValid(message: string): boolean {
        return message.includes('reset the end');
    }
}
