import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Product } from '../shared/models/product';
import { ShopService } from './shop.service';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shopParams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  brands: Brand[] = [];
  types: Type[] = [];
  shopParams: ShopParams;
  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to high', value: 'priceAsc' },
    { name: 'Price: High to low', value: 'priceDesc' },
  ];
  totalCount = 0;
  @ViewChild('search') searchTerm?: ElementRef;

  constructor(private _shopService: ShopService) {
    this.shopParams = _shopService.shopParams;
  }

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts() {
    console.log(this.shopParams);
    this._shopService.getProducts().subscribe({
      next: response => {
        this.products = response.data;
        this.totalCount = response.count;
      },
      error: error => console.log(error),
    });
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
    const params = this._shopService.getShopParams();
    params.brandId = brandId;
    params.pageIndex = 1;
    this._shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts();
  }
  onTypeSelected(typeId: number) {
    const params = this._shopService.getShopParams();
    params.typeId = typeId;
    params.pageIndex = 1;
    this._shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts();
  }
  onSortSelected(event: any) {
    const params = this._shopService.getShopParams();
    params.sort = event.target.value;
    this._shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts();
  }

  onPageChanged(event: any) {
    const params = this._shopService.getShopParams();
    if (params.pageIndex !== event) {
      params.pageIndex = event;
      this._shopService.setShopParams(params);
      this.shopParams = params;
      this.getProducts();
    }
  }

  onSearch() {
    const params = this._shopService.getShopParams();
    params.search = this.searchTerm?.nativeElement.value;
    params.pageIndex = 1;
    this._shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts();
  }

  onReset() {
    if (this.searchTerm) this.searchTerm.nativeElement.value = '';
    const params = new ShopParams();
    this._shopService.setShopParams(params);
    this.getProducts();
  }
}
