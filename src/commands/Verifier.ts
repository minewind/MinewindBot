import { Message } from 'discord.js';
import { Command } from './Command';
import { MinecraftBot } from '../bot/MinecraftBot';
import { Logger } from '../Logger';
import { config } from '../Config';
import Redis from 'ioredis';

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const VERIFICATION_EXPIRY_SECONDS = 300; // 5 minutes

export class VerifierCommand extends Command {
  name = 'verify';
  aliases = [];
  description = 'Verifies your Minecraft account.';

  private readonly mc: MinecraftBot;
  private readonly redis: Redis;
  private readonly logger: Logger;

  constructor(mc: MinecraftBot, redis: Redis, logger: Logger) {
    super();
    this.mc = mc;
    this.redis = redis;
    this.logger = logger;
  }

  async execute(message: Message, args: string[]): Promise<void> {
    if (message.channel.id !== config.mainServer.channels.verifier) {
      await message.reply(`This command can only be used in the <#${config.mainServer.channels.verifier}> channel.`);
      return;
    }
    
    const minecraftUsername = args[0];
    if (!minecraftUsername || !/^[a-zA-Z0-9_]{3,16}$/.test(minecraftUsername)) {
        await message.reply('Please provide a valid Minecraft username. Usage: `!verify <username>`');
        return;
    }

    const userId = message.author.id;
    const verificationKey = `verification:${userId}`;

    const existingData = await this.redis.get(verificationKey);
    if (existingData) {
      await message.reply('You already have a pending verification. Please use the code that was sent to your DMs.');
      return;
    }

    const code = generateCode();
    // Store username and code for later lookup
    const verificationPayload = JSON.stringify({ username: minecraftUsername, code });
    await this.redis.set(verificationKey, verificationPayload, 'EX', VERIFICATION_EXPIRY_SECONDS);

    const command = `/msg ${minecraftUsername} Your verification code is: ${code}. Reply with this code in the bot's DMs.`;
    this.mc.sendMessage(command);
    this.logger.log(`Sent verification code to ${minecraftUsername} for Discord user ${message.author.tag}`);
    
    try {
        await message.author.send(
            `A verification code has been sent to **${minecraftUsername}** via in-game message.\n` +
            `Please send the code back in this DM channel to complete verification.\n` +
            `The code will expire in 5 minutes.`
        );
        await message.reply('I have sent you a DM with further instructions.');
    } catch (error) {
        this.logger.error(`Could not send DM to ${message.author.tag}. They might have DMs disabled.`);
        await message.reply('I could not send you a DM. Please enable DMs from server members to proceed.');
        // Clean up the pending verification since they can't receive the instructions
        await this.redis.del(verificationKey);
    }
  }
}
