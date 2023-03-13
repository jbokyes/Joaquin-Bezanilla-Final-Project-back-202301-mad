import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Auth, PayloadToken } from './auth.js';
import { config } from '../config.js';

jest.mock('bcryptjs');
jest.mock('../config', () => ({
  __dirname: 'testdir',
  config: {
    jwtSecret: 'a',
  },
}));
jest.mock('jsonwebtoken');

describe('Given the auth class', () => {
  describe('When we call the createToken method', () => {
    test('Then it should call the jwt.sign method', () => {
      const testpayload = {
        id: '2',
        email: 'test',
        role: 'admin',
      };
      Auth.createJWT(testpayload);
      expect(jwt.sign).toHaveBeenCalled();
    });
  });
  describe('When we call for the token payload', () => {
    describe('When a secret is not provided', () => {
      test('Then it should throw an httperror', () => {
        (jwt.verify as jest.Mock).mockReturnValue('string');
        expect(() => Auth.getTokenPayload('')).toThrow();
      });
    });
  });
  describe('When the hash method is called', () => {
    test('Then, it should return the mock value of bcrypt.hash have been called', () => {
      Auth.hash('test');
      expect(bcrypt.hash).toHaveBeenCalled();
    });
  });
  describe('When the compare method is called', () => {
    test('Then, it should return the mock value of bcrypt.compare and have been called', () => {
      Auth.compare('test', 'testHash');
      expect(bcrypt.compare).toHaveBeenCalled();
    });
  });
});
