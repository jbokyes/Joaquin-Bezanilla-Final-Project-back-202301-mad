import { Request, Response, NextFunction } from 'express';
import { UsersMongoRepo } from '../repository/user.mongo.repo';
import { UsersController } from './users.controller';

describe('Given UsersController', () => {
  const repo: UsersMongoRepo = {
    queryAll: jest.fn(),
    queryId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    search: jest.fn(),
  };

  const req = {
    body: { email: 'a', passwd: 'a', id: '1' },
  } as unknown as Request;
  const resp = {
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn() as NextFunction;

  const controller = new UsersController(repo);

  describe('Given the login function', () => {
    test('Then it should return json data of the login account', async () => {
      const req = {
        body: { email: 'a', passwd: 'a', id: '1' },
      } as unknown as Request;
      await controller.login(req, resp, next);
      expect(repo.search).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then it should give us an error when not given a correct email or password', async () => {
      const req = {
        body: { passwd: 'a' },
      } as unknown as Request;
      (repo.search as jest.Mock).mockRejectedValue(new Error());
      await controller.login(req, resp, next);
      expect(repo.search).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
});
