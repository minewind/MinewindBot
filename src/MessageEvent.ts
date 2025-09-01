import { codeBlock, escapeCodeBlock } from 'discord.js';
import { ping } from './util';

export abstract class BaseMessageEvent {
  message: string;
  name: string = 'base';
  channel: string | null = null;

  constructor(message: string) {
    this.message = message;
  }

  static isValid(_message: string): boolean {
    throw new Error("isValid method not implemented.");
  }

  generateDiscordMessage(): string {
    return codeBlock(escapeCodeBlock(this.message));
  }
}

export class PingableEvent extends BaseMessageEvent {
  private readonly roleIds: string[];

  constructor(message: string, ...roleIds: string[]) {
    super(message);
    this.roleIds = roleIds.filter(id => !!id);
  }

  generateDiscordMessage(): string {
    const rolePings = this.roleIds.map(id => ping(id)).join(' ');
    return `${this.message} ${rolePings}`;
  }
}
