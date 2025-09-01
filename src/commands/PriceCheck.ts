import { Message } from 'discord.js';
import { Command } from './Command';
import { EssencePriceChecker } from '../bot/essences/EssencePriceChecker';

export class PriceCheckCommand extends Command {
  name = 'pc';
  aliases = ['pricecheck'];
  description = 'Checks the price of an essence.';

  private static checker = new EssencePriceChecker();

  constructor() {
    super();
    PriceCheckCommand.checker.init();
  }

  async execute(message: Message, args: string[]): Promise<void> {
    await PriceCheckCommand.checker.init();

    const essenceName = args.join(' ');
    if (!essenceName) {
      await message.reply('Please provide an essence name. Usage: `!pc <essence>`');
      return;
    }

    const price = PriceCheckCommand.checker.getPrice(essenceName);

    if (price !== undefined) {
      await message.reply(`The price of **${essenceName}** is approximately **${price}** diamonds.`);
    } else {
      await message.reply(`Could not find a price for **${essenceName}**.`);
    }
  }
}
