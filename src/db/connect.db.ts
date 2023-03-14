import mongoose from 'mongoose';
import { config } from '../config.js';
const { user, password, cluster, name } = config;

export const dbConnect = () => {
  const uri = `mongodb+srv://${user}:${password}@${cluster}/${name}?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
};
