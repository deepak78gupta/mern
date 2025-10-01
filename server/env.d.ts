declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    DB_URL: string;
    JWT_SECRET: string;
    NODE_ENV: "development" | "production" | "test";
  }
}
