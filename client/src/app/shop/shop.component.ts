import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Product } from '../shared/models/product';
import { ShopService } from './shop.service';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shopParams';
import { AppState } from '../reducers';
import { Store, select } from '@ngrx/store';

import { selectShopParams } from './store/shop.selectors';
import { Observable, map, take, tap } from 'rxjs';
import { initialShopState } from './store/shop.reducers';
import { ShopActions } from './store/action-types';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  totalCount = 0;
  shopParams$: Observable<ShopParams> = this.store.pipe(
    select(selectShopParams),
    tap(params => console.log(params))
  );

  products$ = this.route.data.pipe(
    map(data => {
      const products: Product[] | undefined = data['products']['products'];
      this.totalCount = data['products']['total']
        ? data['products']['total']
        : 0;
      return products ? products : null;
    })
  );

  brands: Brand[] = [];
  types: Type[] = [];

  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to high', value: 'priceAsc' },
    { name: 'Price: High to low', value: 'priceDesc' },
  ];

  @ViewChild('search') searchTerm?: ElementRef;

  constructor(
    private _shopService: ShopService,
    private store: Store<AppState>,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getBrands();
    this.getTypes();
  }

  getBrands() {
    this._shopService.getBrands().subscribe({
      next: response => (this.brands = [{ id: 0, name: 'All' }, ...response]),
      error: error => console.log(error),
    });
  }
  getTypes() {
    this._shopService.getTypes().subscribe({
      next: response => (this.types = [{ id: 0, name: 'All' }, ...response]),
      error: error => console.log(error),
    });
  }
  onBrandSelected(brandId: number) {
    this.shopParams$.pipe(take(1)).subscribe(shopParams => {
      const updatedShopParams: ShopParams = {
        ...shopParams,
        brandId,
        pageIndex: 1,
      };
      this.store.dispatch(
        ShopActions.ProductsApiActions.filtersChanged({
          shopParams: updatedShopParams,
        })
      );
    });
  }

  onTypeSelected(typeId: number) {
    this.shopParams$.pipe(take(1)).subscribe(shopParams => {
      const updatedShopParams: ShopParams = {
        ...shopParams,
        typeId,
        pageIndex: 1,
      };
      this.store.dispatch(
        ShopActions.ProductsApiActions.filtersChanged({
          shopParams: updatedShopParams,
        })
      );
    });
  }
  onSortSelected(event: any) {
    this.shopParams$.pipe(take(1)).subscribe(shopParams => {
      const updatedShopParams: ShopParams = {
        ...shopParams,
        sort: event.target.value,
      };
      this.store.dispatch(
        ShopActions.ProductsApiActions.filtersChanged({
          shopParams: updatedShopParams,
        })
      );
    });
  }

  onPageChanged(event: any) {
    this.shopParams$.pipe(take(1)).subscribe(shopParams => {
      const updatedShopParams: ShopParams = { ...shopParams, pageIndex: event };
      this.store.dispatch(
        ShopActions.ProductsApiActions.filtersChanged({
          shopParams: updatedShopParams,
        })
      );
    });
  }

  onSearch() {
    this.shopParams$.pipe(take(1)).subscribe(shopParams => {
      const updatedShopParams: ShopParams = {
        ...shopParams,
        pageIndex: 1,
        search: this.searchTerm?.nativeElement.value,
      };
      this.store.dispatch(
        ShopActions.ProductsApiActions.filtersChanged({
          shopParams: updatedShopParams,
        })
      );
    });
  }

  onReset() {
    if (this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.store.dispatch(
      ShopActions.ProductsApiActions.filtersChanged({
        shopParams: { ...initialShopState.shopParams },
      })
    );
  }
}
