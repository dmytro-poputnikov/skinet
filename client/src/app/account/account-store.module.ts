import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromAccount from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { AccountEffects } from './account.effects';

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forFeature(
      fromAccount.accountFeatureKey,
      fromAccount.accountReducer,
      {
        metaReducers: fromAccount.metaReducers,
      },
    ),
    EffectsModule.forFeature([AccountEffects]),
  ],
  exports: [],
})
export class AccountStoreModule {}
