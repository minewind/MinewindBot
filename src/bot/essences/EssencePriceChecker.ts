import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

export class EssencePriceChecker {
  private readonly essenceMap: Map<string, number> = new Map();
  private readonly marginalizedMap: Map<string, number> = new Map();
  private isInitialized = false;

  constructor() {
    // Constructor is intentionally empty. Initialization is handled by the async method.
  }

  /**
   * Asynchronously loads and parses the CSV files. Ensures it only runs once.
   */
  public async init(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    const pricesPath = path.join(__dirname, 'prices.csv');
    const aliasesPath = path.join(__dirname, 'aliases.csv');

    try {
      const [pricesContent, aliasesContent] = await Promise.all([
        fs.promises.readFile(pricesPath, 'utf8'),
        fs.promises.readFile(aliasesPath, 'utf8'),
      ]);

      const prices: [string, string][] = parse(pricesContent);
      const aliases: [string, string][] = parse(aliasesContent);

      for (const [name, priceStr] of prices) {
        const price = parseInt(priceStr, 10);
        if (!isNaN(price)) {
          const cleanedName = this.cleanString(name);
          this.essenceMap.set(name, price);
          this.marginalizedMap.set(cleanedName, price);
        }
      }

      for (const [alias, name] of aliases) {
        const price = this.essenceMap.get(name);
        if (price !== undefined) {
          const cleanedAlias = this.cleanString(alias);
          this.marginalizedMap.set(cleanedAlias, price);
        }
      }

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize EssencePriceChecker:", error);
    }
  }

  private cleanString(s: string): string {
    return s.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  public getPrice(name: string): number | undefined {
    if (!this.isInitialized) {
        // Or you could throw an error if init() hasn't been called.
        console.error("EssencePriceChecker not initialized. Call init() first.");
        return undefined;
    }
    const cleanedName = this.cleanString(name);
    return this.marginalizedMap.get(cleanedName);
  }
}
