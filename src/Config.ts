import * as fs from 'fs';
import * as path from 'path';

interface ChannelConfig {
  chat: string;
  events: string;
  welcome: string;
  debug: string;
  deatheffect: string;
  giveaway: string;
  snovasion: string;
  labyrinth: string;
  beef: string;
  resets: string;
  verifier: string;
}

interface RoleConfig {
  snovasion: string;
  labyrinth: string;
  beef: string;
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
      throw new Error('config.json not found. Please create one in the root directory.');
    }
    const rawData = fs.readFileSync(configPath, 'utf-8');
    this.values = JSON.parse(rawData);
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  public getMainServer(): ServerConfig & { channels: ChannelConfig; roles: RoleConfig } {
    return this.values.mainServer;
  }

  public getOtherServers(): ServerConfig[] {
    return this.values.otherServers;
  }
}

export const config = Config.getInstance().values;
