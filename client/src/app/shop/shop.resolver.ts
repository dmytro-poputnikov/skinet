import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  tap,
  first,
  finalize,
  switchMap,
  map,
  filter,
  catchError,
} from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';

import { Product, ShopParams, mapShopParams } from '../shared/models';
import {
  selectAllPaginatorsEntities,
  selectShopParams,
} from './store/shop.selectors';
import { ShopActions } from './store/action-types';

export const ProductsResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<{ products: Product[]; total: number } | null> => {
  const store = inject(Store<AppState>);
  let isLoading = false;
  const shopParams = mapShopParams(route);
  console.log(shopParams);

  return store.pipe(
    select(selectAllPaginatorsEntities),
    map(entities => entities[Object.values(shopParams).join('-')]),
    tap(entity => {
      if (entity === undefined && !isLoading) {
        isLoading = true;
        store.dispatch(ShopActions.ProductsApiActions.loadData({ shopParams }));
      }
    }),
    filter(entity => !!entity),
    map(entity => {
      return { products: entity!.data, total: entity!.count };
    }),
    first(),
    catchError(() => {
      return of(null);
    }),
    finalize(() => (isLoading = false))
  );
};
