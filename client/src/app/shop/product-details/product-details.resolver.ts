import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import {
  tap,
  first,
  finalize,
  filter,
  catchError,
  switchMap,
} from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { ShopActions } from '../store/action-types';
import {
  selectAllPaginators,
  selectProductById,
} from '../store/shop.selectors';
import { Product } from 'src/app/shared/models';
import { BasketService } from 'src/app/basket/basket.service';
import { ProductDetailsService } from './product-details.service';
import { BreadcrumbService } from 'xng-breadcrumb';

export const ProductResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<Product | null> => {
  const store = inject(Store<AppState>);
  const basketService = inject(BasketService);
  const productDetailsService = inject(ProductDetailsService);
  const breadcrumbService = inject(BreadcrumbService);
  let isLoading = false;
  const id = route.paramMap.get('id');
  if (id === null) return of(null);

  return basketService.basketSource$.pipe(
    tap(basket => {
      const item = basket?.items.find(x => x.id === +id);
      if (item) {
        productDetailsService.setQuantity(item.quantity);
      }
    }),
    switchMap(_ => {
      return store.pipe(
        select(selectProductById(+id)),
        tap(product => {
          if (product === null && !isLoading) {
            isLoading = true;
            store.dispatch(ShopActions.ProductApiActions.loadData({ id: +id }));
          }
        }),
        filter(product => !!product),
        tap(product => breadcrumbService.set('@productDetails', product!.name)),
        first(),
        catchError(() => {
          isLoading = false;
          return of(null);
        }),
        finalize(() => (isLoading = false)),
      );
    }),
  );
};
