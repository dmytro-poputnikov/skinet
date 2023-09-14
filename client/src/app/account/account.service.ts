import { Injectable } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Address, LoginDto, RegisterDto, User } from '../shared/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AccountState } from './reducers';
import { currentUser } from './account.selectors';
import { AccountActions } from './action-types';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  readonly baseUrl = environment.apiUrl;
  readonly currentUser$: Observable<User | null> =
    this.store.select(currentUser);

  constructor(
    private http: HttpClient,
    private store: Store<AccountState>
  ) {}

  /**
   * Register the new user.
   * @param payload - The register DTO to process.
   * @returns An `Observable` that emits the `User` object.
   */
  register(payload: RegisterDto) {
    return this.http
      .post<User>(this.baseUrl + 'account/register', payload)
      .pipe(tap(user => this.store.dispatch(AccountActions.login({ user }))));
  }

  /**
   * Loads the current user based on the provided authentication token.
   * @param token - The authentication token to process.
   * @returns An `Observable` that emits the `User` object or `null` if no user is found.
   */
  loadCurrentUser(token: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(this.baseUrl + 'account', { headers }).pipe(
      map(user => {
        if (user) {
          this.store.dispatch(AccountActions.login({ user }));
          return user;
        } else {
          return null;
        }
      })
    );
  }

  login(values: LoginDto) {
    return this.http
      .post<User>(this.baseUrl + 'account/login', values)
      .pipe(tap(user => this.store.dispatch(AccountActions.login({ user }))));
  }

  checkEmailExists(email: string) {
    return this.http.get<boolean>(
      this.baseUrl + 'account/emailExists?email=' + email
    );
  }

  getUserAddress() {
    return this.http.get<Address>(this.baseUrl + 'account/address');
  }

  updateUserAddress(address: Address) {
    return this.http.put<Address>(this.baseUrl + 'account/address', address);
  }
}
