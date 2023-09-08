import { Injectable } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Address, User } from '../shared/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';

import { AccountState } from './reducers';
import { currentUser } from './account.selectors';
import { AccountActions } from './action-types';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  readonly baseUrl = environment.apiUrl;
  readonly currentUser$: Observable<User | null> = this.store.pipe(
    select(currentUser)
  );

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<AccountState>
  ) {}

  loadCurrentUser(token: string | null) {
    if (token === null) {
      return of(null);
    }

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

  register(values: any) {
    return this.http
      .post<User>(this.baseUrl + 'account/register', values)
      .pipe(tap(user => this.store.dispatch(AccountActions.login({ user }))));
  }

  login(values: any) {
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
