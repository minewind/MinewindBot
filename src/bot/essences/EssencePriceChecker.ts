import * as fs from "fs";
import * as Papa from "papaparse";
import logger from "../../Logger";
import { unspaceAndLowercase } from "../../util";

export class EssencePriceChecker {
	essenceMap!: Map<string, Essence>;
	essenceMapMaginalized!: Map<string, Essence>;

	constructor() {
		this.update();
	}

	update() {
		const file = fs.readFileSync("./src/bot/essences/prices.csv", "utf-8");
		const alias_file = fs.readFileSync(
			"./src/bot/essences/aliases.csv",
			"utf-8",
		);
		const grid = Papa.parse<string[]>(file).data;
		const alias_grid = Papa.parse<string[]>(alias_file).data;

		const price_tiers = extract_price_tiers(grid);
		const essences = extract_essences(grid, price_tiers);
		parseAndInsertAliases(alias_grid, essences);
		this.essenceMap = generateFullMap(essences);
		this.essenceMapMaginalized = marginalizeMap(this.essenceMap);
	}

	processMessage(message: string) {
		logger.debug(`Processing command ${message}`);
		message = message.toLowerCase();

		const pcRegex = /^- *pc (.*?) ?([1-5]|i|ii|iii|iv|v)?$/;

		if (pcRegex.test(message)) {
			const match = message.match(pcRegex);
			if (match === null) return;
			const spellName = match[1];
			const raw_level = match[2] || "1";
			const rn_to_num = {
				i: 1,
				ii: 2,
				iii: 3,
				iv: 4,
				v: 5,
			};
			const level =
				raw_level in rn_to_num ? rn_to_num[raw_level] : Number(raw_level);
			logger.debug(`"${spellName}": ${level}`);
			const ess: Essence | undefined = this.lookupEssence(spellName);
			if (typeof ess === "undefined") {
				return "Unable to price check that item";
			} else {
				return ess.generatePriceString(level);
			}
		}
	}

	lookupEssence(essenceName: string): Essence | undefined {
		const cleanedName = unspaceAndLowercase(essenceName);
		if (cleanedName in this.essenceMapMaginalized) {
			return this.essenceMapMaginalized[cleanedName];
		}
	}
}

class PriceTier {
	title: string;
	value: string;

	constructor(title, value) {
		this.title = title;
		this.value = value;
	}
}

function extract_price_tiers(grid: string[][]) {
	const price_tiers: PriceTier[] = [];
	for (let i = 13; i < 28; i++) {
		const title = grid[i][12];
		const value = grid[i][11].toLowerCase();
		price_tiers.push(new PriceTier(title, value));
	}
	return price_tiers;
}

export class Essence {
	cap: number;
	title: string;
	aliases: string[] = [];
	prices: string[];

	constructor(title: string, cap: number, prices: string[]) {
		this.title = title;
		this.cap = cap;
		this.prices = prices;
	}

	static from_line(line: string[]): Essence | undefined {
		if (line.length !== 7) {
			return undefined;
		}
		if (line[0] === "") {
			return undefined;
		}
		const [title, cap_str, ...prices] = line;
		const cap = Number(cap_str) || 1;
		return new Essence(title, cap, prices);
	}

	generatePriceString(tier: number): string {
		const idx = tier - 1;
		if (tier > this.cap || this.prices[idx] === "") {
			return `PC: ${this.title} is not available in tier ${tier}`;
		} else if (this.prices[idx] === "(no ess form)") {
			return `PC: ${this.title} is not available in ess form at tier ${tier}`;
		} else {
			return `PC: ${this.title} ${tier} costs ${this.prices[idx]}`;
		}
	}

	updatePrices(price_tiers: PriceTier[]) {
		for (let i = 0; i < this.prices.length; i++) {
			for (const tier of price_tiers) {
				this.prices[i] = this.prices[i].replace(
					new RegExp(tier.title, "g"),
					tier.value,
				);
			}
		}
	}

	addAliases(aliases: string[]) {
		this.aliases.push(...aliases);
	}

	toString() {
		return `${this.title}@${this.cap}:${this.prices}`;
	}
}

function extract_essences(
	grid: string[][],
	price_tiers: PriceTier[],
): Map<string, Essence> {
	const essences = new Map<string, Essence>();
	for (const row of grid) {
		const current = Essence.from_line(row.slice(1, 8));
		if (typeof current === "undefined") continue;
		current.updatePrices(price_tiers);
		essences[current.title] = current;
	}
	return essences;
}

function parseAndInsertAliases(
	grid: string[][],
	essences: Map<string, Essence>,
) {
	for (const row of grid) {
		const [title, ...aliases] = row;
		if (title in essences) {
			essences[title].addAliases(aliases);
		}
	}
}

function generateFullMap(essences: Map<string, Essence>) {
	const fullMap = new Map<string, Essence>();
	for (const essence of Object.values(essences)) {
		fullMap[essence.title.toLowerCase()] = essence;
		for (const alias of essence.aliases) {
			console.log(`Adding ${alias} for ${essence.title}`);
			fullMap[alias.toLowerCase()] = essence;
		}
	}
	return fullMap;
}

function marginalizeMap(fullMap: Map<string, Essence>): Map<string, Essence> {
	const marginalizeMap: Map<string, Essence> = new Map();
	for (const [name, essence] of Object.entries(fullMap)) {
		marginalizeMap[unspaceAndLowercase(name)] = essence;
	}
	return marginalizeMap;
}
