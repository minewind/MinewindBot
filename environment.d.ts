declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DISCORD_TOKEN: string;
			MINECRAFT_IP: string;
			MINECRAFT_USERNAME: string;
			MINECRAFT_PASSWORD: string;
			REDIS_USERNAME: string;
			REDIS_PASSWORD: string;
			INFLUXDB_HOST: string;
			INFLUXDB_DATABASE: string;
			INFLUXDB_TOKEN: string;
			REDIS_HOST: string;
			REDIS_PORT: number;
			//NODE_ENV: 'development' | 'production';
			//PORT?: string;
			//PWD: string;
		}
	}
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
