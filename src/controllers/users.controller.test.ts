import { Request, Response } from 'express';
import { Food } from '../entities/food';
import { Auth } from '../helpers/auth';
import { RequestWithToken } from '../interceptors/interceptors';
import { Repo } from '../repository/repo.interface';
import { UsersController } from './users.controller';
jest.mock('../helpers/auth');
describe('Given the UsersController', () => {
  const mockRepoUsers = {
    queryAll: jest.fn(),
    queryId: jest.fn(),
    search: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const mockRepoFoods = {
    queryId: jest.fn(),
  } as unknown as Repo<Food>;
  const controller = new UsersController(mockRepoUsers, mockRepoFoods);
  const resp = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();
  describe('When the register method is called', () => {
    test('And all the data is correctly introduced, there should be a status and a json response', async () => {
      const req = {
        body: {
          email: 'test1',
          passwd: 'pass',
        },
      } as unknown as Request;
      await controller.register(req, resp, next);
      expect(mockRepoUsers.create).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('And the email is missing, next function will be called', async () => {
      const req = {
        body: {
          passwd: 'pa',
        },
      } as unknown as Request;
      mockRepoUsers.create.mockRejectedValue('error');
      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('And the password is missing, next function will be called', async () => {
      const req = {
        body: {
          email: 'test3',
        },
      } as unknown as Request;
      mockRepoUsers.create.mockRejectedValue('error');
      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When the login method is called', () => {
    test('And all the data is correctly introduced, there should be a status and a json response', async () => {
      const req = {
        body: {
          id: '2',
          username: 'test',
          email: 'test',
          passwd: '111',
        },
      } as unknown as Request;
      mockRepoUsers.search.mockResolvedValue([1]);
      Auth.compare = jest.fn().mockResolvedValue(true);
      await controller.login(req, resp, next);
      expect(mockRepoUsers.search).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('And the email is missing, next function will be called', async () => {
      const req = {
        body: {
          password: 'a',
        },
      } as unknown as Request;
      mockRepoUsers.search.mockRejectedValue('error');
      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('There it should be an HTTPError if search doesnt find the data', async () => {
      const req = {
        body: {
          email: 'joaquin@chile.cl',
          passwd: 'HOLAJOAQUIN123',
        },
      } as unknown as Request;
      mockRepoUsers.search.mockResolvedValue([]);
      await controller.login(req, resp, next);
      expect(mockRepoUsers.search).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
    test('Then it should throw an HTTPError if the password is wrong', async () => {
      const req = {
        body: {
          email: 'pep',
          passwd: 'pass',
        },
      } as unknown as Request;
      Auth.compare = jest.fn().mockResolvedValue(false);
      mockRepoUsers.search.mockResolvedValue([1]);
      await controller.login(req, resp, next);
      expect(mockRepoUsers.search).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
    test('And the password is missing, next function will be called', async () => {
      const req = {
        body: {
          email: 'test',
        },
      } as unknown as Request;
      mockRepoUsers.search.mockRejectedValue('error');
      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('And auth.compare returns false, next function will be called', async () => {
      const req = {
        body: {
          email: 'test',
        },
      } as unknown as Request;
      mockRepoUsers.search.mockRejectedValue('error');
      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When addFood method is called', () => {
    test('Then if the user information is complete, it should return resp.status and resp.json', async () => {
      const req = {
        tokenInfo: {
          id: '10',
        },
        params: {
          id: '20',
        },
      } as unknown as RequestWithToken;
      mockRepoUsers.queryId.mockResolvedValue({
        addFoods: [{ id: '1' }],
      });
      (mockRepoFoods.queryId as jest.Mock).mockResolvedValue({ foodId: '10' });
      await controller.addFavouriteFood(req, resp, next);
      expect(mockRepoUsers.update).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
  });
  test('Then if there is no tokenInfo in the req information, it should catch an error and call a next function', async () => {
    const req = {
      tokenInfo: undefined,
    } as unknown as RequestWithToken;
    await controller.addFavouriteFood(req, resp, next);
    expect(next).toHaveBeenCalled();
  });
  test('Then if there is no food ID in req params, it should catch an error and call a next function', async () => {
    const req = {
      tokenInfo: {
        id: '1',
      },
      params: {
        id: undefined,
      },
    } as unknown as RequestWithToken;
    await controller.addFavouriteFood(req, resp, next);
    expect(next).toHaveBeenCalled();
  });
  test('Then if the id of the food dish is incorrect and can not be found in the food repo, it should catch an error and the next function have been called', async () => {
    const req = {
      tokenInfo: {
        id: '30',
      },
      params: {
        id: '40',
      },
    } as unknown as RequestWithToken;
    mockRepoUsers.queryId.mockResolvedValue({
      addFoods: [{ id: 40 }],
    });
    (mockRepoFoods.queryId as jest.Mock).mockResolvedValue([{ id: '40' }]);
    await controller.addFavouriteFood(req, resp, next);
    expect(next).toHaveBeenCalled();
  });
  test('Then if the food is already added to addFoods, it should catch the error and next function have been called', async () => {
    const req = {
      tokenInfo: {
        id: '10',
      },
      params: {
        id: '10',
      },
    } as unknown as RequestWithToken;
    mockRepoUsers.queryId.mockResolvedValue({
      addFoods: [{ id: '10' }],
    });
    (mockRepoFoods.queryId as jest.Mock).mockResolvedValue({ id: '10' });
    await controller.addFavouriteFood(req, resp, next);
    expect(next).toHaveBeenCalled();
  });
  describe('When removeFood method is called', () => {
    test('Then if the user information is completed, it should return the resp.status and resp.json', async () => {
      const req = {
        tokenInfo: {
          id: '1',
        },
        params: {
          id: '2',
        },
      } as unknown as RequestWithToken;
      mockRepoUsers.queryId.mockResolvedValue({
        addFoods: [{ id: '1' }, { id: '2' }],
      });
      (mockRepoFoods.queryId as jest.Mock).mockResolvedValue({ id: '2' });
      await controller.removeFavouriteFood(req, resp, next);

      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then if there is no tokenInfo in the req information, it should catch an error and next function have been called', async () => {
      const req = {
        tokenInfo: undefined,
      } as unknown as RequestWithToken;
      await controller.removeFavouriteFood(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('Then if there is no food id in the req.params, it should catch an error and next function have been called', async () => {
      const req = {
        tokenInfo: {
          id: '1',
        },
        params: {
          id: undefined,
        },
      } as unknown as RequestWithToken;
      await controller.removeFavouriteFood(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('Then if the id of the food dish is incorrect and can not be found in the repo, it should catch an error and the next function should be called', async () => {
      const req = {
        tokenInfo: {
          id: '1',
        },
        params: {
          id: '20',
        },
      } as unknown as RequestWithToken;
      (mockRepoFoods.queryId as jest.Mock).mockResolvedValue(undefined);
      await controller.removeFavouriteFood(req, resp, next);
      expect(mockRepoUsers.update).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
});
