import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

export const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  cluster: process.env.DB_CLUSTER,
  name: process.env.DB_NAME,
  jwtSecret: process.env.SECRET,
};
