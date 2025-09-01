import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

interface ChannelConfig {
  chat: string;
  events: string;
  welcome: string;
  debug: string;
  death: string;
  sharpening: string;
  snovasion: string;
  labyrinth: string;
  beef: string;
  abyssal: string;
  attack_on_giant: string;
  fox_hunt: string;
  bait: string;
  castle: string;
  tdm: string;
  ffa: string;
  verifier: string; 
}

interface RoleConfig {
  general: string;
  snovasion: string;
  labyrinth: string;
  beef: string;
  abyssal: string;
  attack_on_giant: string;
  fox_hunt: string;
  bait: string;
  castle: string;
  tdm: string;
  ffa: string;
}

interface ServerConfig {
  id: string;
  channels: Partial<ChannelConfig>;
  roles?: Partial<RoleConfig>;
}

interface ConfigType {
  discordToken: string;
  minecraft: {
    username: string;
    password?: string;
    server: string;
  };
  redis: {
    host: string;
    port: number;
  };
  mainServer: ServerConfig & { channels: ChannelConfig; roles: RoleConfig };
  otherServers: ServerConfig[];
}

class Config {
  private static instance: Config;
  public readonly values: ConfigType;

  private constructor() {
    const configPath = path.join(__dirname, '..', '..', 'config.json');
    if (!fs.existsSync(configPath)) {
      throw new Error('config.json not found. A base config.json file is required for non-sensitive values like channel IDs.');
    }
    const rawData = fs.readFileSync(configPath, 'utf-8');
    const configFromFile = JSON.parse(rawData);

    this.values = {
      ...configFromFile,
      discordToken: process.env.DISCORD_TOKEN || configFromFile.discordToken,
      minecraft: {
        ...configFromFile.minecraft,
        username: process.env.MINECRAFT_USERNAME || configFromFile.minecraft.username,
        password: process.env.MINECRAFT_PASSWORD || configFromFile.minecraft.password,
      },
      redis: {
        ...configFromFile.redis,
        host: process.env.REDIS_HOST || configFromFile.redis.host,
        port: process.env.REDIS_PORT
          ? parseInt(process.env.REDIS_PORT, 10)
          : configFromFile.redis.port,
      },
    };

    if (!this.values.discordToken || this.values.discordToken === "YOUR_DISCORD_BOT_TOKEN") {
      throw new Error("DISCORD_TOKEN is missing. Please provide it in your environment variables or config.json.");
    }
    if (!this.values.minecraft.username || this.values.minecraft.username === "YOUR_MINECRAFT_EMAIL") {
      throw new Error("MINECRAFT_USERNAME is missing. Please provide it in your environment variables or config.json.");
    }
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
}

export const config = Config.getInstance().values;
