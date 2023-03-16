import { FoodsController } from './food.controller';
import { NextFunction, Request, Response } from 'express';
import { Food } from '../entities/food';
import { Repo } from '../repository/repo.interface';

describe('Given the controller FoodsController', () => {
  const mockFoodRepo = {
    queryAll: jest.fn(),
    queryId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    search: jest.fn(),
  } as unknown as Repo<Food>;

  const controller = new FoodsController(mockFoodRepo);

  const resp = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as unknown as NextFunction;

  describe('When Post method is called', () => {
    test('Then if the food information is completed, it should return the resp.status and resp.json', async () => {
      const req = {
        body: {
          name: 'test',
          region: 'Chile',
        },
      } as unknown as Request;

      await controller.post(req, resp, next);
      expect(mockFoodRepo.create).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there is req.body.region is All, it should be catch the error and next function have been called', async () => {
      const req = {
        body: {
          region: 'none',
        },
      } as unknown as Request;
      (mockFoodRepo.search as jest.Mock).mockRejectedValueOnce(
        'No guitar info'
      );
      await controller.getAll(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if there is no food region in the req.body, it should be catch the error and next function have been called', async () => {
      const req = {
        body: {
          name: 'test',
        },
      } as unknown as Request;

      (mockFoodRepo.create as jest.Mock).mockRejectedValueOnce('No food info');
      await controller.post(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When Get method is called', () => {
    (mockFoodRepo.queryAll as jest.Mock).mockResolvedValue([
      { id: '1' },
      { id: '2' },
      { id: '3' },
    ]);

    (mockFoodRepo.search as jest.Mock).mockResolvedValue([
      { id: '1' },
      { id: '2' },
      { id: '3' },
    ]);

    test('Then if the food information is completed, it should return the resp.status and resp.json', async () => {
      const req = {
        query: {
          page: '1',
          region: 'Chile',
        },
      } as unknown as Request;

      await controller.getAll(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there is no information in req.query, it should return the resp.status and resp.json with the req.query default values', async () => {
      const req = {
        query: {
          page: undefined,
          region: undefined,
        },
      } as unknown as Request;

      await controller.getAll(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if req.body.page is less than 1, it should be catch the error and next function have been called', async () => {
      const req = {
        query: {
          page: '0',
        },
      } as unknown as Request;

      await controller.getAll(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if req.body.page is more than 5, it should be catch the error and next function have been called', async () => {
      const req = {
        query: {
          page: '6',
        },
      } as unknown as Request;

      await controller.getAll(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if req.body.style is not Electric or Acoustic or All, it should be catch the error and next function have been called', async () => {
      const req = {
        query: {
          region: 'test',
        },
      } as unknown as Request;

      await controller.getAll(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When getId method is called', () => {
    test('Then if the user information is completed, it should return the resp.status and resp.json', async () => {
      const req = {
        params: {
          id: '1',
        },
      } as unknown as Request;

      await controller.getId(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there is no the guitar id in the req.params, it should be catch the error and next function have been called', async () => {
      const req = {
        params: {
          id: undefined,
        },
      } as unknown as Request;

      await controller.getId(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
