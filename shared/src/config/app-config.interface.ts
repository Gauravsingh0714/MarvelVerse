import { Environment } from '../enums/environment.enum.js';

export interface AppConfig {
  env: Environment;
  port: number;
  apiPrefix: string;
  apiVersion: string;
}
