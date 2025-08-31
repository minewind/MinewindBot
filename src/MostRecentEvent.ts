import { RedisClientType } from "redis";

export class MostRecentEvent {
	name: string | null = null;
	client: RedisClientType<any>;
	constructor(client: RedisClientType<any>) {
		this.client = client;
	}

	async init() {
		this.name = await this.client.get("MostRecentEvent");
	}

	set(newName: string) {
		if (this.name === newName) return;
		this.client.set("MostRecentEvent", newName);
		this.name = newName;
	}

	get() {
		return this.name;
	}
}
