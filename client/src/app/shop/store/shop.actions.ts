import {
  createAction,
  createActionGroup,
  emptyProps,
  props,
} from '@ngrx/store';

import { HttpErrorResponse } from '@angular/common/http';
import { ShopParams, Pagination, Product } from 'src/app/shared/models';

export const ProductsApiActions = createActionGroup({
  source: 'Products API',
  events: {
    'Load Data': props<{ shopParams: ShopParams }>(),
    'Load Data Success': props<{ paginator: Pagination<Product[]> }>(),
    'Load Data Error': props<{ error: string }>(),
    'Filters Changed': props<{ shopParams: ShopParams }>(),
  },
});

export const ProductApiActions = createActionGroup({
  source: 'Product API',
  events: {
    'Load Data': props<{ id: number }>(),
    'Load Data Success': props<{ product: Product }>(),
    'Load Data Error': props<{ error: string }>(),
  },
});
