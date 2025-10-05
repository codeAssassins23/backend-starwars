export interface IEnviroments {
  port: number;
  nodeEnv: string;
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
    ssl: boolean;
    synchronize: boolean;
  };
}
