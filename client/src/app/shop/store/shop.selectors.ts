import {
  MemoizedSelector,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import { Pagination, Product } from '../../shared/models';
import * as fromShop from './shop.reducers';

export const selectProductsState =
  createFeatureSelector<fromShop.ProductsState>('products');

export const selectAllPaginatorsEntities = createSelector(
  selectProductsState,
  fromShop.selectEntities,
);

export const selectAllPaginators = createSelector(
  selectProductsState,
  fromShop.selectAll,
);

export const selectShopParams = createSelector(
  selectProductsState,
  state => state.shopParams,
);

export const selectProductById = (productId: number) =>
  createSelector(selectAllPaginators, paginators => {
    if (!productId) return null;
    for (const paginator of paginators) {
      const product = paginator.data.find(p => p.id === productId);
      if (product) {
        return product;
      }
    }
    return null;
  });

//https://timdeschryver.dev/blog/parameterized-selectors#memoization
