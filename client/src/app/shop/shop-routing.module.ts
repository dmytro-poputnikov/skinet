import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ShopComponent } from './shop.component';
import { ProductResolver } from './product-details/product-details.resolver';
import { ProductsResolver } from './shop.resolver';

const routes: Routes = [
  {
    path: '',
    component: ShopComponent,
    resolve: {
      products: ProductsResolver,
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },
  {
    path: ':id',
    component: ProductDetailsComponent,
    resolve: {
      product: ProductResolver,
    },
    data: { breadcrumb: { alias: 'productDetails' } },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {}
