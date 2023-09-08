import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { map, tap } from 'rxjs';
import { ProductDetailsService } from './product-details.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent {
  product$ = this.route.data.pipe(
    map(data => data['product']),
    tap(product => this.breadcrumbService.set('@productDetails', product?.name))
  );

  quantity$ = this.productDetailsService.getQuantity();
  quantityInBasket$ = this.productDetailsService.getQuantityInBasket();

  constructor(
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private productDetailsService: ProductDetailsService
  ) {
    this.breadcrumbService.set('@productDetails', ' ');
  }

  incrementQuantity() {
    this.productDetailsService.incrementQuantity();
  }

  decrementQuantity() {
    this.productDetailsService.decrementQuantity();
  }

  updateBasket(product: Product) {
    this.productDetailsService.updateBasket(product);
  }
}
