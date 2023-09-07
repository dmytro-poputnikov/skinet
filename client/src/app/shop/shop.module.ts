import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { SharedModule } from '../shared/shared.module';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ShopRoutingModule } from './shop-routing.module';
import { EffectsModule } from '@ngrx/effects';

import { StoreModule } from '@ngrx/store';
import * as fromShop from './store/shop.reducers';
import { shopEffects } from './store/shop.effects';

@NgModule({
  declarations: [ShopComponent, ProductItemComponent, ProductDetailsComponent],
  imports: [
    CommonModule,
    SharedModule,
    ShopRoutingModule,
    StoreModule.forFeature(
      fromShop.productFeatureKey,
      fromShop.productsReducer,
    ),
    EffectsModule.forFeature([shopEffects]),
  ],
  exports: [],
})
export class ShopModule {}
