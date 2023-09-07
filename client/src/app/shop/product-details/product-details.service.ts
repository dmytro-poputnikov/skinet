import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { Product } from 'src/app/shared/models';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailsService {
  constructor(private basketService: BasketService) {}

  private readonly quantity = new BehaviorSubject(1);
  private readonly quantity$ = this.quantity.asObservable();
  private readonly quantityInBasket = new BehaviorSubject(0);
  private readonly quantityInBasket$ = this.quantityInBasket.asObservable();

  getQuantity() {
    return this.quantity$;
  }

  setQuantity(quanity: number) {
    this.quantity.next(quanity);
    this.quantityInBasket.next(quanity);
  }

  getQuantityInBasket() {
    return this.quantityInBasket$;
  }

  incrementQuantity() {
    this.quantity.next(this.quantity.value + 1);
  }

  decrementQuantity() {
    this.quantity.next(this.quantity.value - 1);
  }

  updateBasket(product: Product) {
    let quantity = this.quantity.value;
    let quantityInBasket = this.quantityInBasket.value;

    if (product) {
      if (quantity > quantityInBasket) {
        const countToAddItems = quantity - quantityInBasket;
        quantityInBasket += countToAddItems;
        this.basketService.addItemToBasket(product, countToAddItems);
      } else {
        const countToRemoveItems = quantityInBasket - quantity;
        quantityInBasket -= countToRemoveItems;
        this.basketService.removeItemFromBasket(product.id, countToRemoveItems);
      }
    }
  }
}
