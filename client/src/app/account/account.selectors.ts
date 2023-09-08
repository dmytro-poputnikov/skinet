import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AccountState, accountFeatureKey } from './reducers';

export const selectAccountState =
  createFeatureSelector<AccountState>(accountFeatureKey);

export const currentUser = createSelector(
  selectAccountState,
  account => account.user
);
