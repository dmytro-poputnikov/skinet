import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Product, Pagination, ShopParams } from 'src/app/shared/models';

import { HttpErrorResponse } from '@angular/common/http';
import { ShopActions } from './action-types';

export const productFeatureKey = 'products';

export enum Status {
  PENDING = 'PENDING',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export interface ProductsState extends EntityState<Pagination<Product[]>> {
  shopParams: ShopParams;
  status: Status;
}

export const adapter = createEntityAdapter<Pagination<Product[]>>({});

export const initialShopState: ProductsState = adapter.getInitialState({
  shopParams: {
    brandId: 0,
    typeId: 0,
    sort: 'name',
    pageIndex: 1,
    pageSize: 6,
    search: '',
  },
  error: null,
  status: Status.PENDING,
});

export const productsReducer = createReducer(
  initialShopState,
  //Trigger loading the products
  on(
    ShopActions.ProductsApiActions.filtersChanged,
    (state, { shopParams }) => ({
      ...state,
      shopParams,
    }),
  ),

  //Trigger loading the products
  on(ShopActions.ProductsApiActions.loadData, (state, { shopParams }) => ({
    ...state,
    shopParams,
    error: null,
    status: Status.LOADING,
  })),
  //Handle successfully loaded products
  on(ShopActions.ProductsApiActions.loadDataSuccess, (state, action) =>
    adapter.upsertOne(action.paginator, {
      ...state,
      error: null,
      status: Status.SUCCESS,
    }),
  ),
  //Handle products load failure
  on(ShopActions.ProductsApiActions.loadDataError, (state, { error }) => ({
    ...state,
    error: error,
    status: Status.ERROR,
  })),

  //Handle successfully loaded products
  on(ShopActions.ProductApiActions.loadDataSuccess, (state, action) => {
    const newPaginator: Pagination<Product[]> = {
      id: 'temp',
      pageIndex: 1,
      pageSize: 1,
      count: 1,
      data: [action.product],
    };

    return adapter.upsertOne(newPaginator, {
      ...state,
      error: null,
      status: Status.SUCCESS,
    });
  }),

  on(ShopActions.ProductApiActions.loadDataError, (state, { error }) => ({
    ...state,
    error: error,
    status: Status.ERROR,
  })),
);

export const { selectEntities, selectIds, selectAll } = adapter.getSelectors();
