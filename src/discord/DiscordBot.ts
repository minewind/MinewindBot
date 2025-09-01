import { Client, GatewayIntentBits, Partials, TextChannel } from 'discord.js';
import { CommandManager } from '../commands/CommandManager';
import { BaseMessageEvent } from '../MessageEvent';
import { Logger } from '../Logger';
import { config } from '../Config';

export class DiscordBot {
  private readonly client: Client;
  private readonly token: string;
  private readonly logger: Logger;

  constructor(token: string, logger: Logger) {
    this.token = token;
    this.logger = logger;
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
      ],
      partials: [Partials.Channel], 
    });
  }

  async start(dcToMcQueue: string[], commandManager: CommandManager): Promise<void> {
    this.client.on('ready', () => {
      this.logger.log(`Logged in as ${this.client.user?.tag}!`);
    });

    this.client.on('messageCreate', async (message) => {
      if (message.author.bot) return;

      if (message.content.startsWith('!')) {
        await commandManager.execute(message);
        return;
      }

      // Forward chat only from the designated channel
      if (message.channel.id === config.mainServer.channels.chat) {
        dcToMcQueue.push(`<${message.author.username}> ${message.content}`);
      }
    });

    await this.client.login(this.token);
  }

  sendAll(events: BaseMessageEvent[]): void {
    for (const event of events) {
      this.send(event);
    }
  }

  async send(event: BaseMessageEvent): Promise<void> {
    if (!event.channel) return;

    try {
      const channel = await this.client.channels.fetch(event.channel);
      if (channel instanceof TextChannel) {
        await channel.send(event.generateDiscordMessage());
      }
    } catch (error) {
      this.logger.error(`Failed to send message to channel ${event.channel}:`, error);
    }
  }
}
