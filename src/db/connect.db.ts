import mongoose from 'mongoose';
import { config } from '../config.js';
const { user, password, cluster, name } = config;

export const dbConnect = () => {
  const dbName =
    process.env.NODE_ENV !== 'test' ? 'LATINO_FOODS' : 'TEST_LATINO';
  const uri = `mongodb+srv://${user}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
};
