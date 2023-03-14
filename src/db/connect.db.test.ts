import { dbConnect } from './connect.db.js';
import mongoose from 'mongoose';

jest.mock('mongoose');
jest.mock('../config.js', () => ({
  _dirname: 'test',
  config: {
    secret: 'test',
  },
}));
describe('Given the dbconnect function', () => {
  dbConnect();

  describe('When called', () => {
    test('Then it should call the mongoose.connect', () => {
      expect(mongoose.connect).toHaveBeenCalled();
    });
  });
});
