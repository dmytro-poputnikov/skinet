import { Pagination } from '../shared/models/pagination';
import { Product } from '../shared/models/product';

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shopParams';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { ShopActions } from './store/action-types';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = environment.apiUrl;
  products: Product[] = [];
  brands: Brand[] = [];
  types: Type[] = [];
  pagination?: Pagination<Product[]>;

  constructor(
    private http: HttpClient,
    private store: Store<AppState>
  ) {}

  getProducts(shopParams: ShopParams): Observable<Pagination<Product[]>> {
    let params = new HttpParams();
    if (shopParams.brandId > 0)
      params = params.append('brandId', shopParams.brandId);
    if (shopParams.typeId > 0)
      params = params.append('typeId', shopParams.typeId);
    params = params.append('sort', shopParams.sort);
    params = params.append('pageIndex', shopParams.pageIndex);
    params = params.append('pageSize', shopParams.pageSize);
    if (shopParams.search) params = params.append('search', shopParams.search);

    return this.http
      .get<Pagination<Product[]>>(this.baseUrl + 'products', {
        params,
      })
      .pipe(
        map(response => {
          this.pagination = response;
          return { ...response, id: Object.values(shopParams).join('-') };
        })
      );
  }

  getProduct(id: number) {
    return this.http.get<Product>(this.baseUrl + 'products/' + id);
  }

  setShopParams(params: ShopParams) {
    this.store.dispatch(
      ShopActions.ProductsApiActions.filtersChanged({ shopParams: params })
    );
  }

  getBrands() {
    if (this.brands.length > 0) return of(this.brands);

    return this.http
      .get<Brand[]>(this.baseUrl + 'products/brands')
      .pipe(map(brands => (this.brands = brands)));
  }

  getTypes() {
    if (this.types.length > 0) return of(this.types);
    return this.http
      .get<Type[]>(this.baseUrl + 'products/types')
      .pipe(map(types => (this.types = types)));
  }
}
