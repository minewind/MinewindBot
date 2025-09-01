import { Message } from 'discord.js';
import { MinecraftBot } from '../bot/MinecraftBot';
import { MostRecentEvent } from '../MostRecentEvent';
import { Logger } from '../Logger';
import { Command } from './Command';
import { HelpCommand } from './Help';
import { PlayersCommand } from './Players';
import { PriceCheckCommand } from './PriceCheck';
import { UpcomingCommand } from './Upcoming';
import { VerifierCommand } from './Verifier';
import Redis from 'ioredis';

export class CommandManager {
  private readonly commands: Map<string, Command> = new Map();

  constructor(mc: MinecraftBot, mostRecentEvent: MostRecentEvent, redis: Redis, logger: Logger) {
    const commandInstances: Command[] = [
      new HelpCommand(),
      new PlayersCommand(mc),
      new PriceCheckCommand(),
      new UpcomingCommand(mostRecentEvent),
      new VerifierCommand(mc, redis, logger),
    ];
    
    for (const command of commandInstances) {
        this.addCommand(command);
    }
  }

  private addCommand(command: Command): void {
    this.commands.set(command.name.toLowerCase(), command);
    for (const alias of command.aliases) {
      this.commands.set(alias.toLowerCase(), command);
    }
  }

  async execute(message: Message): Promise<void> {
    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    const command = this.commands.get(commandName);
    if (command) {
      try {
        await command.execute(message, args);
      } catch (error) {
        console.error(`Error executing command ${commandName}:`, error);
        await message.reply('An error occurred while executing that command.');
      }
    } else {
      // Silently ignore unknown commands to reduce spam
    }
  }
}
