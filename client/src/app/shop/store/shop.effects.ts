import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ShopActions } from './action-types';
import { catchError, concatMap, filter, map, of, switchMap, tap } from 'rxjs';
import { ShopService } from '../shop.service';
import { Router } from '@angular/router';
import { initialShopState } from './shop.reducers';

@Injectable()
export class shopEffects {
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShopActions.ProductsApiActions.loadData),
      concatMap(action => this.shopService.getProducts(action.shopParams)),
      map(paginator =>
        ShopActions.ProductsApiActions.loadDataSuccess({ paginator })
      ),
      catchError(error =>
        of(ShopActions.ProductsApiActions.loadDataError({ error }))
      )
    )
  );

  filtersChanged$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ShopActions.ProductsApiActions.filtersChanged),
        map(action => {
          const queryParams = { ...action.shopParams };
          const initialParams = initialShopState.shopParams;

          for (const key in queryParams) {
            if (
              queryParams[key] === initialParams[key] || // Check if it's the same as the initial value
              queryParams[key] === '' || // Check if it's an empty string
              queryParams[key] === null // Check if it's null
            ) {
              delete queryParams[key];
            }
          }
          return queryParams;
        }),
        tap(queryParams => this.router.navigate(['/shop'], { queryParams }))
      ),
    { dispatch: false }
  );

  loadProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShopActions.ProductApiActions.loadData),
      concatMap(action => this.shopService.getProduct(action.id)),
      map(product =>
        ShopActions.ProductApiActions.loadDataSuccess({ product })
      ),
      catchError(error =>
        of(ShopActions.ProductApiActions.loadDataError({ error }))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private shopService: ShopService,
    private router: Router
  ) {}
}
