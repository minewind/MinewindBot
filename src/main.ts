import { MinecraftBot } from './bot/MinecraftBot';
import { DiscordBot } from './discord/DiscordBot';
import { CommandManager } from './commands/CommandManager';
import { Logger } from './Logger';
import { cleanMinecraftJson } from './util';
import { MostRecentEvent } from './MostRecentEvent';
import { BaseMessageEvent } from './MessageEvent';
import { processMessage } from './events/EventRegistry';
import { config } from './Config';
import Redis from 'ioredis';

const logger = new Logger();
const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
});
const discord = new DiscordBot(config.discordToken, logger);
const mc = new MinecraftBot(
  {
    username: config.minecraft.username,
    password: config.minecraft.password,
    server: config.minecraft.server,
  },
  logger
);
const mostRecentEvent = new MostRecentEvent();
const commandManager = new CommandManager(mc, mostRecentEvent, redis, logger);

const mcToDcQueue: BaseMessageEvent[] = [];
const dcToMcQueue: string[] = [];

async function main() {
  await discord.start(dcToMcQueue, commandManager);
  await mc.start(mcToDcQueue);
  logger.log('Systems online.');
  
  pollMinecraftQueue();
  pollDiscordQueue();
}

function pollMinecraftQueue() {
  const messages = mc.retrieveMessages();
  for (let message of messages) {
    message = cleanMinecraftJson(message);
    const event = processMessage(message);

    if (event) {
      mostRecentEvent.set(event);
      mcToDcQueue.push(event);
    } else if (message.startsWith('[') && message.includes(']')) {
      const chatEvent = new BaseMessageEvent(message);
      chatEvent.channel = config.mainServer.channels.chat;
      mcToDcQueue.push(chatEvent);
    } else {
		
    }
  }

  if (mcToDcQueue.length > 0) {
    logger.log(`Forwarding ${mcToDcQueue.length} events to Discord.`);
    discord.sendAll(mcToDcQueue);
    mcToDcQueue.length = 0; 
  }

  setTimeout(pollMinecraftQueue, 1000); 
}

function pollDiscordQueue() {
  const messages = [...dcToMcQueue]; 
  dcToMcQueue.length = 0; 

  for (const message of messages) {
    mc.sendMessage(message);
  }

  setTimeout(pollDiscordQueue, 1000);
}

main().catch(error => {
  logger.error('Critical error in main function:', error);
  process.exit(1);
});
