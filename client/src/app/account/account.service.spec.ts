import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AccountService } from './account.service';
import { AccountActions } from './action-types';
import { LoginDto, RegisterDto, User } from '../shared/models';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAccountState } from './reducers';

describe('AccountService', () => {
  let service: AccountService;
  let httpMock: HttpTestingController;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request when registering a user', () => {
    const registerDto: RegisterDto = {
      displayName: 'luckyboy224',
      email: 'correctemail@gmail.com',
      password: 'P@$$w0rd',
    };
    const expectedUserResponse: User = {
      email: registerDto.email,
      displayName: registerDto.displayName,
      token: 'super-secret-token',
    };

    // Mock the store.dispatch method
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    service.register(registerDto).subscribe(user => {
      expect(user).toEqual(expectedUserResponse); // Ensure that the service returns the expected user data
      expect(dispatchSpy).toHaveBeenCalledWith(AccountActions.login({ user })); // Ensure that the store.dispatch method was called with the expected action
    });

    const req = httpMock.expectOne(`${service.baseUrl}account/register`);
    expect(req.request.method).toBe('POST');
    req.flush(expectedUserResponse);
    httpMock.verify();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send a POST request when loging a user', () => {
    const loginDto: LoginDto = {
      email: 'correctemail@gmail.com',
      password: 'P@$$w0rd',
    };

    const expectedUserResponse: User = {
      email: loginDto.email,
      displayName: 'luckyboy224',
      token: 'super-secret-token',
    };

    const dispatchSpy = jest.spyOn(store, 'dispatch');

    service.login(loginDto).subscribe(user => {
      expect(user).toEqual(expectedUserResponse);
      expect(dispatchSpy).toHaveBeenCalledWith(AccountActions.login({ user }));
    });

    const req = httpMock.expectOne(`${service.baseUrl}account/login`);
    expect(req.request.method).toBe('POST');
    req.flush(expectedUserResponse);
    httpMock.verify();
  });
});
