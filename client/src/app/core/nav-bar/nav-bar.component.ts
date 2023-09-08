import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { currentUser } from 'src/app/account/account.selectors';
import { AccountService } from 'src/app/account/account.service';
import { AccountActions } from 'src/app/account/action-types';
import { BasketService } from 'src/app/basket/basket.service';
import { AppState } from 'src/app/reducers';
import { BasketItem } from 'src/app/shared/models/basket';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  public readonly currentUser$ = this.store.pipe(select(currentUser));

  constructor(
    public basketService: BasketService,
    private store: Store<AppState>
  ) {}

  getCount(items: BasketItem[]) {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  logout() {
    this.store.dispatch(AccountActions.logout());
  }
}
