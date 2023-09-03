import { isDevMode } from '@angular/core';
import { ActionReducerMap, createReducer, on, MetaReducer } from '@ngrx/store';
import { User } from 'src/app/shared/models/user';
import * as AccountActions from '../account.actions';

export const accountFeatureKey = 'account';

export interface AccountState {
  user: User | null;
}

export const initialAccountState: AccountState = {
  user: null,
};

export const accountReducer = createReducer(
  initialAccountState,
  on(AccountActions.login, (state, action) => {
    return {
      user: action.user,
    };
  }),
  on(AccountActions.logout, (state, action) => {
    return {
      user: null,
    };
  }),
);

// export const reducers: ActionReducerMap<AccountState> = {};

export const metaReducers: MetaReducer<AccountState>[] = isDevMode() ? [] : [];
