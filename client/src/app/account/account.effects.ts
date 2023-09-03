import { Injectable } from '@angular/core';

import { AccountActions } from './action-types';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';

@Injectable()
export class AccountEffects {
  login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AccountActions.login),
        tap(action => localStorage.setItem('token', action.user.token)),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AccountActions.logout),
        tap(action => {
          localStorage.removeItem('token');
          this.router.navigateByUrl('/');
        }),
      ),
    { dispatch: false },
  );

  constructor(private actions$: Actions, private router: Router) {}
}
