import { TestBed } from '@angular/core/testing';
import { AccountService } from './account.service';
import { AccountActions } from './action-types';
import { Address, LoginDto, RegisterDto, User } from '../shared/models';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAccountState } from './reducers';
import { HttpClientModule } from '@angular/common/http';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { environment } from 'src/environments/environment';
import { waitFor } from '@testing-library/angular';

const baseUrl = environment.apiUrl;

describe('AccountService', () => {
  let requestBody: any;
  const shouldReturnError500 = false;

  const userResponse: User = {
    email: 'correctemail@gmail.com',
    displayName: 'luckyboy224',
    token: 'super-secret-token',
  };

  const addressResponse: Address = {
    firstName: 'test',
    lastName: 'test',
    street: 'test',
    city: 'test',
    state: 'test',
    zipcode: 'test',
  };

  // Helper function to define the common rest handler
  function createRestHandler(response?: any) {
    return async (req: any, res: any, ctx: any) => {
      requestBody = await req.json();
      if (shouldReturnError500) {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      } else {
        return res(ctx.status(200), ctx.json(response));
      }
    };
  }

  const server = setupServer(
    rest.post(`${baseUrl}account/register`, createRestHandler(userResponse)),
    rest.post(`${baseUrl}account/login`, createRestHandler(userResponse)),
    rest.get(`${baseUrl}account/address`, createRestHandler(addressResponse)),
    rest.put(`${baseUrl}account/address`, createRestHandler(addressResponse))
  );

  let service: AccountService;
  let store: MockStore;

  beforeAll(() => server.listen());
  afterAll(() => server.close());

  beforeEach(() => {
    requestBody = null;

    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        provideMockStore({
          initialState: {
            account: initialAccountState,
          },
        }),
        AccountService,
      ],
    });

    service = TestBed.inject(AccountService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('POST requests', () => {
    it('should send a POST request to register a user and dispatch the login action', async () => {
      const registerDto: RegisterDto = {
        email: userResponse.email,
        displayName: userResponse.displayName,
        password: 'P@$$w0rd',
      };

      // Mock the store.dispatch method
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      service.register(registerDto).subscribe(user => {
        expect(user).toEqual(userResponse); // Ensure that the service returns the expected user data
        expect(dispatchSpy).toHaveBeenCalledWith(
          AccountActions.login({ user })
        ); // Ensure that the store.dispatch method was called with the expected action
      });

      await waitFor(() => {
        expect(requestBody).toEqual(registerDto);
      });
    });

    it('should send a POST request to login a user and dispatch the login action', async () => {
      const loginDto: LoginDto = {
        email: userResponse.email,
        password: 'P@$$w0rd',
      };

      // Mock the store.dispatch method
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      service.login(loginDto).subscribe(user => {
        expect(user).toEqual(userResponse); // Ensure that the service returns the expected user data
        expect(dispatchSpy).toHaveBeenCalledWith(
          AccountActions.login({ user })
        ); // Ensure that the store.dispatch method was called with the expected action
      });

      await waitFor(() => {
        expect(requestBody).toEqual(loginDto);
      });
    });
  });

  describe('GET requets', () => {
    it('should send a GET request to get user address', async () => {
      service
        .getUserAddress()
        .subscribe(address => expect(address).toEqual(addressResponse));

      await waitFor(() => {
        expect(requestBody).toBeNull();
      });
    });
  });

  describe('PUT requets', () => {
    const newUserAddress: Address = addressResponse;

    it('should send a PUT request to update user address', async () => {
      service
        .updateUserAddress(newUserAddress)
        .subscribe(address => expect(address).toEqual(newUserAddress));

      await waitFor(() => {
        expect(requestBody).toBeNull();
      });
    });
  });
});
