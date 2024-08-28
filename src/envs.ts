/// <reference path="./envs.d.ts" />

import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(__dirname, "../.env") });

export const envs = {
  AWS_ACCOUNT_ID: process.env.AWS_ACCOUNT_ID,
  GITHUB_REF: process.env.GITHUB_REF_NAME,
  STACK_NAME: process.env.STACK_NAME,
  AWS_REGION: process.env.AWS_REGION,
  STAGE: process.env.STAGE,
  MONGO_URI: process.env.MONGO_URI,
  EMAIL_LOGIN: process.env.EMAIL_LOGIN,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
};
