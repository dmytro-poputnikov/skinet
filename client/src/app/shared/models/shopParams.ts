import { ActivatedRouteSnapshot } from '@angular/router';
import { initialShopState } from 'src/app/shop/store/shop.reducers';

export interface ShopParams {
  brandId: number;
  typeId: number;
  sort: string;
  pageIndex: number;
  pageSize: number;
  search: string;

  // Add an index signature to allow string keys
  [key: string]: string | number | undefined | null;
}

export function mapShopParams(snapshot: ActivatedRouteSnapshot): ShopParams {
  console.log(snapshot);
  const params: ShopParams = {
    brandId:
      +snapshot.queryParams['brandId'] || initialShopState.shopParams.brandId,
    typeId:
      +snapshot.queryParams['typeId'] || initialShopState.shopParams.typeId,
    sort: snapshot.queryParams['sort'] || initialShopState.shopParams.sort,
    pageIndex:
      +snapshot.queryParams['pageIndex'] ||
      initialShopState.shopParams.pageIndex,
    pageSize:
      +snapshot.queryParams['pageSize'] || initialShopState.shopParams.pageSize,
    search:
      snapshot.queryParams['search'] || initialShopState.shopParams.search,
  };
  console.log(params);

  return params;
}
