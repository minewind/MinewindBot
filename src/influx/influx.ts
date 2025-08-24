import { InfluxDBClient } from "@influxdata/influxdb3-client";

import dotenv from "dotenv";
import logger from "../Logger";

dotenv.config();
const token = process.env.INFLUXDB_TOKEN;

export class InfluxDatabase {
	_client: InfluxDBClient;
	_database: string;

	constructor() {
		this._client = new InfluxDBClient({
			host: process.env.INFLUXDB_HOST,
			token: token,
		});
		this._database = process.env.INFLUXDB_DATABASE;
	}

	close() {
		this._client.close();
	}

	add(point) {
		logger.debug("Injesting", point);
		this._client.write(point, this._database);
	}
}
